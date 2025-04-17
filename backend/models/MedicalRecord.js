const mongoose = require("mongoose");
const createAuditLog = require("../middlewares/auditMiddleware");

const MedicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String },
    medications: [{ type: String }], // List of prescribed meds
    symptoms: [{ type: String }],
    notes: { type: String },
    visitDate: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);
createAuditLog(MedicalRecordSchema, "MedicalRecord");
module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);
