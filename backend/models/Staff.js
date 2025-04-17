const mongoose = require("mongoose");
const createAuditLog = require("../middlewares/auditMiddleware");

const User = require("./User");

const StaffSchema = new mongoose.Schema(
  {
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }, 
  },
  { timestamps: true }
);

// Apply audit log middleware
createAuditLog(StaffSchema, "Staff");
module.exports = User.discriminator("Staff", StaffSchema);
