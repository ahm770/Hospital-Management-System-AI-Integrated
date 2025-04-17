const winston = require('winston');
const { format } = winston;
const { combine, timestamp, label, printf, colorize, json } = format;
require('winston-daily-rotate-file'); // For daily log rotation

// Define log levels
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};

// Define custom log format
const logFormat = printf(({ level, message, label, timestamp, stack }) => {
    return `${timestamp} [${label}] ${level}: ${message} ${stack || ''}`;
});

const isDev = process.env.NODE_ENV === 'development';

let transports = [
    new winston.transports.Console({
        level: 'silly',   //remove this line for default info level
        format: combine(
            colorize({ all: true }),
            label({ label: 'Hospital-Management-System' }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        )
    })
];

// Add file transport in production
if (!isDev) {
    transports.push(
        new winston.transports.DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(
                label({ label: 'Hospital-Management-System' }),
                timestamp(),
                json()
            )
        })
    );
}

// Create Winston logger
const logger = winston.createLogger({
    levels: logLevels,
    format: combine(
        label({ label: 'Hospital-Management-System' }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        logFormat
    ),
    transports: transports,
    exceptionHandlers: [
        new winston.transports.Console(), // Console for exceptions
        new winston.transports.File({ filename: 'logs/exceptions.log' }) //File for exceptions
    ],
    rejectionHandlers: [
        new winston.transports.Console(), // Console for rejections
        new winston.transports.File({ filename: 'logs/rejections.log' }) //File for rejections
    ],
});

module.exports = logger;