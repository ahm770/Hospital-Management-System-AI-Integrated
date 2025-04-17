const EventEmitter = require("events");
const Notification = require("../models/Notification");

const notificationEmitter = new EventEmitter();

/**
 * Send a notification (WebSocket & Database)
 * @param {string} userId - The recipient's user ID
 * @param {string} message - Notification message
 * @param {string} type - Type of notification ("appointment", "medical_record", "system", "reminder")
 */
const sendNotification = async (userId, message, type) => {
  try {
    // Determine priority based on type
    let priority = "info";
    if (type === "medical_record") priority = "urgent";
    else if (type === "appointment") priority = "warning";
    else if (type === "system") priority = "info";

    // Create and save the notification
    const notification = new Notification({ 
      user: userId, 
      message, 
      type, 
      priority 
    });
    await notification.save();

    // Emit the new notification event
    if (global.io) {
      global.io.to(userId).emit("newNotification", { message, type, priority });

      // Emit updated unread notification count
      const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
      global.io.to(userId).emit("notificationCount", { count: unreadCount });
    }

    // Emit event for other services (if needed)
    notificationEmitter.emit("notificationSent", { userId, message, type, priority });

  } catch (error) {
    console.error("Notification Error:", error);
  }
};

module.exports = { sendNotification, notificationEmitter };
