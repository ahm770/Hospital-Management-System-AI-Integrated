// utils/logger.ts

const isDev = process.env.NODE_ENV === 'development';

// Define an environment variable to control log levels
// const logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL || (isDev ? 'debug' : 'warn')) as keyof LogLevels;
const logLevel = 'silly'
// Define log levels with explicit type
interface LogLevels {
    silly: number;
    debug: number;
    log: number;
    info: number;
    warn: number;
    error: number;
}

const logLevels: LogLevels = {
    silly: 0,
    debug: 1,
    log: 2,
    info: 3,
    warn: 4,
    error: 5,
};

// Helper function to check if a level is enabled
const isLevelEnabled = (level: keyof LogLevels): boolean => {
    if (!(level in logLevels)) {
        return false;
    }
    return logLevels[level] >= logLevels[logLevel];
};

const logger1 = {
    log: (...args: any[]) => {
        if (isLevelEnabled('log')) {
            console.log('[INFO]', ...args);
        }
    },
    info: (...args: any[]) => {
        if (isLevelEnabled('info')) {
            console.info('[INFO]', ...args);
        }
    },
    warn: (...args: any[]) => {
        if (isLevelEnabled('warn')) {
            console.warn('[WARN]', ...args);
        }
    },
    error: (...args: any[]) => {
        if (isLevelEnabled('error')) {
            console.error('[ERROR]', ...args);
        }
    },
    debug: (...args: any[]) => {
        if (isLevelEnabled('debug') && isDev) {
            console.debug('[DEBUG]', ...args);
        }
    },
    silly: (...args: any[]) => {
        if (isLevelEnabled('silly') && isDev) {
            console.debug('[SILLY]', ...args);
        }
    },
};

export default logger1;