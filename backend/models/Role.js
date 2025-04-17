const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true }, // e.g., Doctor, Nurse, Receptionist
      permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }], // Role-based permissions
    },
    { timestamps: true }
  );
  
module.exports = mongoose.model('Role', RoleSchema);