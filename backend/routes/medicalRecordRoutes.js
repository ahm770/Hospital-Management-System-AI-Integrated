const express = require("express");
const {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecords,
  getMedicalSummary, 
} = require("../controllers/medicalRecordController");

const checkPermission = require("../middlewares/checkPermission");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, checkPermission("create_medical_record"), createMedicalRecord);
router.put("/:id", authenticate, checkPermission("update_medical_record"), updateMedicalRecord);
router.delete("/:id", authenticate, checkPermission("delete_medical_record"), deleteMedicalRecord);
router.get("/", authenticate, checkPermission("view_medical_record"), getAllMedicalRecords);
router.get("/:patientId/summary", authenticate, checkPermission("view_medical_record"), getMedicalSummary); // ✅ Secure AI Summary

module.exports = router;
