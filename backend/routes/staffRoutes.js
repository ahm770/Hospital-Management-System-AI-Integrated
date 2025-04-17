const express = require("express");
const {
  createStaff,
  updateStaff,
  deleteStaff,
  getAllStaff,
} = require("../controllers/staffController");
const checkPermission = require("../middlewares/checkPermission");
const authenticate  = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Admins & Super Admins can manage staff (with correct permissions)
router.post("/", authenticate, checkPermission("create_staff"), createStaff);
router.put("/:id", authenticate, checkPermission("update_staff"), updateStaff);
router.delete("/:id", authenticate, checkPermission("delete_staff"), deleteStaff);
router.get("/", authenticate, checkPermission("view_staff"), getAllStaff);

module.exports = router;
