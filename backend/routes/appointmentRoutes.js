const express = require("express");
const {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
} = require("../controllers/appointmentController");

const checkPermission = require("../middlewares/checkPermission");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, checkPermission("create_appointment"), createAppointment);
router.put("/:id", authMiddleware, checkPermission("update_appointment"), updateAppointment);
router.delete("/:id", authMiddleware, checkPermission("delete_appointment"), deleteAppointment);
router.get("/", authMiddleware, checkPermission("view_appointment"), getAllAppointments);

module.exports = router;
