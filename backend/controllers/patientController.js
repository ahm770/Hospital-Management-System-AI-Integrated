const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const Role = require("../models/Role");
const logger = require("../utils/logger");

/**
 * Create a new Patient
 */
const createPatient = async (req, res) => {
  try {
    console.log("body::", req.body);

    const { firstName, lastName, email, phone, address, gender, dob } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists." });
    }

    // Fetch the default patient role
    const defaultRole = await Role.findOne({ name: "Patient" }).populate("permissions");
    if (!defaultRole) {
      return res.status(500).json({ message: "Default patient role not found. Please contact an administrator." });
    }

    // Use email as default password
    const defaultPassword = email;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create new patient
    let newPatient = new Patient({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      gender,
      dob,
      userType: "Patient",
      role: defaultRole._id, // Assign default role
      isActive: true,
      forcePasswordChange: true, // Force password change on first login
      createdBy: req.user.id, // Track who created the patient
    });

    await newPatient.save();

    // Fetch patient with populated role and permissions
    newPatient = await Patient.findById(newPatient._id)
      .populate({
        path: "role",
        select: "name", // Populate role name  
       
      })
      .select("-password -__v") // Remove sensitive fields
      .lean();

    res.status(201).json({
      message: "Patient created successfully. Default password has been set.",
      patient: newPatient,
    });
  } catch (error) {
    console.error("Create Patient Error::", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update Patient
 */
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, ...updatedData } = req.body; // Extract email separately

    // Check if patient exists
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // If email is being updated, ensure it's unique
    if (email && email !== patient.email) {
      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(400).json({ message: "Email is already in use by another patient." });
      }
      updatedData.email = email; // Only update email if it's unique
    }

    // Update the patient
    const updatedPatient = await Patient.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: "Patient updated successfully.", patient: updatedPatient });
  } catch (error) {
    logger.error("Update Patient Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete Patient
 */
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    res.status(200).json({ message: "Patient deleted successfully." });
  } catch (error) {
    logger.error("Delete Patient Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get All Patients with Pagination
 */
const getAllPatients = async (req, res) => {
  try {
    let { search, page, limit } = req.query;

    page = parseInt(page) || 1; // Default to page 1
    limit = parseInt(limit) || 10000; // Default limit
    const skip = (page - 1) * limit;

    let query = {};

    // 🔹 If the user is a Doctor, only show their assigned patients
    console.log("getAllPatients user role::", req.user.role.name);
    if (req.user.role.name === "Doctor") {
      query.assignedDoctor = req.user.id;
    }

    // 🔹 Search filter (by first name, last name, email, phone)
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // 🔹 Get total count of matching patients
    const p= await Patient.find()
    console.log("p::", p)
    const totalPatients = await Patient.countDocuments(query);

    // 🔹 Fetch patients  
    const patients = await Patient.find(query)
      .skip(skip)
      .limit(limit)
       

    res.status(200).json({
      totalPatients,
      totalPages: Math.ceil(totalPatients / limit),
      currentPage: page,
      patients,
    });
  } catch (error) {
    logger.error("Get Patients Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

 
module.exports = { 
  createPatient, 
  updatePatient, 
  deletePatient, 
  getAllPatients
};