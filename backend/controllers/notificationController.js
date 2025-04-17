const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    console.log("Notification Query:", req.query);  

    let { search, type, priority, read, page, limit, sortBy, sortOrder } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20; 
    const skip = (page - 1) * limit;

    let filter = { user: req.user.id };

    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    // ✅ Fix: Match `isRead` field name in schema
    if (read !== undefined) {
      filter.isRead = read === "true" ? true : read === "false" ? false : undefined;
    }

    if (search) {
      filter.message = { $regex: search, $options: "i" };
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy) {
      sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    console.log("Filter being applied:", filter);

    const notifications = await Notification.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      notifications,
      currentPage: page,
      totalPages: Math.ceil(totalNotifications / limit),
      totalNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


/**
 * Mark a single notification as read
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },  
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Emit real-time update for unread count
    if (global.io) {
      const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });
      global.io.to(req.user.id).emit("notificationCount", { count: unreadCount });
    }

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });

    // Emit real-time notification count update
    if (global.io) {
      global.io.to(req.user.id).emit("notificationCount", { count: 0 });
    }

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
