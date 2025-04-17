const express = require("express");
const { 
  assignShift, 
  getShifts, 
  updateShift, 
  deleteShift, 
  getMyShifts // ✅ Add this function 
} = require("../controllers/shiftController");
const authenticate = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

// 📌 Shift Management Routes
router.post("/", authenticate, checkPermission("create_shift"), assignShift);
router.get("/", authenticate, checkPermission("view_shift"), getShifts);
router.put("/:id", authenticate, checkPermission("update_shift"), updateShift);
router.delete("/:id", authenticate, checkPermission("delete_shift"), deleteShift);

// ✅ New Route: Staff Fetch Their Own Shifts
router.get("/mine", authenticate, getMyShifts);

module.exports = router;
