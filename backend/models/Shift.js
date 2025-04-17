const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assigned staff member
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }, // Department of the shift
    date: { type: Date, required: true }, // Shift Date
    startTime: { type: String, required: true }, // Start time (e.g., "08:00 AM")
    endTime: { type: String, required: true }, // End time (e.g., "04:00 PM")
    type: { type: String, enum: ["morning", "evening", "night"], required: true }, // Shift type
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" }, // Shift status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", ShiftSchema);
