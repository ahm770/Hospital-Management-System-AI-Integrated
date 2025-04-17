const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    type: { type: String, enum: ["lab_test", "medical_record", "discharge", "prescription", "appointment"], required: true },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: false},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
