// src/middleware/socketMiddleware.ts
const jwt = require('jsonwebtoken');

module.exports = (socket, next) => {
    console.log("in socket service::")
    const token = socket.handshake.auth.token; // Get token from handshake
    console.log(" socket service token::", token)
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
        socket.user = decoded; // Attach user info to socket
        next();
    });
};