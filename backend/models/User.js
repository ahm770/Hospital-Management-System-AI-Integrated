const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    forcePasswordChange: { type: Boolean, default: true },
    phone: { type: String },
    dob: { type: Date },
    address: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    userType: { type: String, enum: ["Patient", "Staff"], required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }

  },
  { timestamps: true, discriminatorKey: "userType" }
);

module.exports = mongoose.model("User", UserSchema);
