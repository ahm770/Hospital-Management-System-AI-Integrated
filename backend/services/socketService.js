const logger = require("../utils/logger");

/**
 * Setup Socket.IO event listeners
 * @param {Object} io - The Socket.IO instance
 */
const setupSocket = (io) => {
  io.on("connection", (socket) => {
    logger.info(`🔌 User connected: ${socket.id}`);

    // Handle user joining a room (e.g., for private notifications)
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      logger.info(`User ${userId} joined their notification room`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      logger.info(`❌ User disconnected: ${socket.id}`);
    });
  });

  // Store io globally so other services can use it
  global.io = io;
};

module.exports = { setupSocket };
