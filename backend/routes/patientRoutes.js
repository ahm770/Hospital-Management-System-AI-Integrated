const express = require("express");
const { createPatient, updatePatient, deletePatient, getAllPatients } = require("../controllers/patientController");
const  authenticate  = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

// 🔒 Super Admins & Admins (with permission) can create patients
router.post("/", authenticate, checkPermission("create_patient"), createPatient);

// 🔒 Only Super Admins (or assigned roles) can remove patients
router.delete("/:id", authenticate, checkPermission("delete_patient"), deletePatient);

// 🔒 Admins (with permission) can update patients
router.put("/:id", authenticate, checkPermission("update_patient"), updatePatient);

// 🔓 Viewing patients can be restricted if needed
router.get("/", authenticate, checkPermission("view_patient"), getAllPatients);

module.exports = router;
