const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Cardiology", "Neurology"
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
