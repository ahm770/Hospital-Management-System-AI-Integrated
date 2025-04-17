const express = require("express");
const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require("../controllers/notificationController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getNotifications);
router.put("/:id/read", authenticate, markNotificationAsRead);
router.put("/read/all", authenticate, markAllNotificationsAsRead);

module.exports = router;
