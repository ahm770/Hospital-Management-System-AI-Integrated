const mongoose = require("mongoose");
const createAuditLog = require("../middlewares/auditMiddleware");

const User = require("./User");

const PatientSchema = new mongoose.Schema(
  {
  
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    medicalRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" }],
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },  

  },
  { timestamps: true }
);

// Apply audit log middleware
createAuditLog(PatientSchema, "Patient");

module.exports = User.discriminator("Patient", PatientSchema);
