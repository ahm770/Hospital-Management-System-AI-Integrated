const MedicalRecord = require("../models/MedicalRecord");
const Staff  = require("../models/Staff");
const { generateMedicalSummary } = require("../services/medicalRecordService");


/**
 * Create a medical record
 */
const createMedicalRecord = async (req, res) => {
  try {
    // Ensure only doctors (or super admins) can create medical records
    // console.log("req.user role::",req.user.role.name)
    if (req.user.role.name !== "Doctor") {
      return res.status(403).json({ message: "Unauthorized: Only doctors can create medical records" });
    }

    const { patient, diagnosis, treatment, notes, medications, symptoms } = req.body;

    // Use the logged-in doctor's ID instead of getting it from the request body
    const doctor = req.user.id; 

    const newRecord = new MedicalRecord({ patient, doctor, diagnosis, treatment, notes, medications, symptoms });
    await newRecord.save();

    res.status(201).json({ message: "Medical record created successfully", record: newRecord });
  } catch (error) {
    console.error("Create Medical Record Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Update a medical record
 */
const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const record = await MedicalRecord.findByIdAndUpdate(id, updates, { new: true });

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({ message: "Medical record updated successfully", record });
  } catch (error) {
    console.error("Update Medical Record Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete a medical record
 */
const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MedicalRecord.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error("Delete Medical Record Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all medical records
 */
const getAllMedicalRecords = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10000;
    const skip = (page - 1) * limit;

    let filter = {};
    const staff = await Staff.findById(req.user.id).populate("role");

    // Role-based access control
    if (req.user.role.name === "Doctor") {
      filter.doctor = req.user.id; // Doctors only see their own patients' records
    } else if (req.user.role.name === "Nurse") {
      // filter.department = staff.department; // Nurses can view records in their department
    } else if (req.user.role.name === "Patient") {
      filter.patient = req.user.id; // Patients only see their own records
    }

    // Fetch medical records with pagination and populate fields
    let records = await MedicalRecord.find(filter)
      .populate("patient", "firstName lastName")
      .populate("doctor", "firstName lastName")
      .skip(skip)
      .limit(limit);

    // Apply search filtering in JavaScript (since MongoDB regex doesn't work on populated fields)
    if (search) {
      const regex = new RegExp(search, "i");
      records = records.filter(
        (record) =>
          regex.test(record.diagnosis) ||
          regex.test(record.patient.firstName) ||
          regex.test(record.patient.lastName) ||
          regex.test(record.doctor.firstName) ||
          regex.test(record.doctor.lastName)
      );
    }

    // Count total medical records for pagination
    const totalRecords = records.length; // Now counting after filtering

    res.status(200).json({
      records,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (error) {
    console.error("Get Medical Records Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




/**
 * Get AI-generated medical summary for a patient
 */
const getMedicalSummary = async (req, res) => {
  try {
    const { patientId } = req.params;
    const summary = await generateMedicalSummary(patientId);
    console.log("ai summary::", summary)
    res.status(200).json({ summary });
  } catch (error) {
    console.error("Medical Summary Error:", error);
    res.status(500).json({ message: "Failed to generate medical summary." });
  }
};


module.exports = { createMedicalRecord, updateMedicalRecord, deleteMedicalRecord, getAllMedicalRecords, getMedicalSummary };
