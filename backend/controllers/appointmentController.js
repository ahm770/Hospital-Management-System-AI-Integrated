const Staff = require("../models/Staff");
const Role = require("../models/Role");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Task = require("../models/Task");
const { notificationEmitter } = require("../services/notificationService");
 
/**
 * AI-powered function to find the best available time slot.
 */
const findBestTimeSlot = async (doctorId, date, patientId) => {
  const doctor = await Staff.findById(doctorId).populate("role");
  if (!doctor || doctor.role.name !== "Doctor") return null;

  const { workingHours } = doctor; // Example: { start: "09:00", end: "17:00" }
  let availableSlots = [];

  let startTime = parseInt(workingHours.start.split(":")[0]);
  let endTime = parseInt(workingHours.end.split(":")[0]);

  for (let hour = startTime; hour < endTime; hour++) {
    availableSlots.push(`${hour}:00`);
    availableSlots.push(`${hour}:30`);
  }

  const bookedAppointments = await Appointment.find({ doctor: doctorId, date });
  const bookedTimes = bookedAppointments.map((appt) => appt.time);
  availableSlots = availableSlots.filter((slot) => !bookedTimes.includes(slot));

  const pastAppointments = await Appointment.find({ patient: patientId }).sort({ date: -1 }).limit(5);
  const preferredTimes = pastAppointments.map((appt) => appt.time);

  return availableSlots.find((slot) => preferredTimes.includes(slot)) || availableSlots[0] || null;
};

/**
 * Create an appointment
 */
const { sendNotification } = require("../services/notificationService");

const createAppointment = async (req, res) => {
  try {
    let { patient, doctor, department, date, time } = req.body;

    if (!patient || !department || !date) {
      return res.status(400).json({ message: "Patient, department, and date are required." });
    }

    // ✅ Check if the patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // ✅ Fetch Doctor Role
    const doctorRole = await Role.findOne({ name: "Doctor" });
    if (!doctorRole) {
      return res.status(500).json({ message: "Doctor role not found." });
    }

    let doctorData = null;

    if (doctor) {
      // ✅ Validate if the provided doctor belongs to the department
      doctorData = await Staff.findOne({ _id: doctor, department, role: doctorRole._id });
      if (!doctorData) {
        return res.status(404).json({ message: "Doctor not found in this department." });
      }
    } else {
      // ✅ Auto-assign doctor (least busy one)
      doctorData = await Staff.findOne({ department, role: doctorRole._id })
        .sort({ appointmentsCount: 1 })
        .select("_id firstName lastName workingHours");

      if (!doctorData) {
        return res.status(404).json({ message: "No available doctors in this department." });
      }

      doctor = doctorData._id;
      console.log("Auto-assigned doctor:", doctorData);
    }
    
    patientExists.assignedDoctor = doctor;
    console.log("assigned doc!!!!")
    await patientExists.save();
      

    // ✅ Auto-assign best available time if not provided
    if (!time) {
      time = await findBestTimeSlot(doctor, date, patient);
      if (!time) {
        return res.status(400).json({ message: "No available time slots for this doctor on the selected date." });
      }
    }

    // ✅ Fetch Receptionist Role
    const receptionistRole = await Role.findOne({ name: "Receptionist" });
    const receptionist = await Staff.findOne({ department, role: receptionistRole._id });

    // ✅ Create Appointment
    const newAppointment = new Appointment({
      patient,
      doctor,
      department,
      date,
      time,
      status: "pending",
      assignedTo: receptionist ? receptionist._id : null,
      createdBy: req.user.id,
    });

    await newAppointment.save();

   
    // ✅ Create a Task for the Receptionist
    if (receptionist) {
      const task = new Task({
        title: "Confirm Appointment",
        description: `Confirm appointment for ${patientExists.firstName} ${patientExists.lastName} with Dr. ${doctorData.firstName} on ${date} at ${time}.`,
        assignedTo: receptionist._id,
        createdBy: req.user.id,
        type: "appointment",
        priority: "medium",
      });

      await task.save();

      // 🔥 Send notification to receptionist using the service
      await sendNotification(
        receptionist._id,
        `📌 New task: Confirm appointment for ${patientExists.firstName}.`,
        "appointment"
      );
    }

    // 🔥 Send notification to patient
    await sendNotification(
      patient,
      `📅 Your appointment with Dr. ${doctorData.firstName} is scheduled on ${date} at ${time}.`,
      "appointment"
    );

    // 🔥 Send notification to doctor
    await sendNotification(
      doctor,
      `👨‍⚕️ New appointment scheduled with patient ${patientExists.firstName} on ${date} at ${time}.`,
      "appointment"
    );

    res.status(201).json({
      message: "Appointment created successfully, and task assigned.",
      appointment: newAppointment,
    });

  } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Get all appointments based on user role
 */
const getAllAppointments = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10000;
    const skip = (page - 1) * limit;

    let filter = {};
    ;

    // Role-based filtering
    if (req.user.role.name === "Doctor") {
      filter.doctor = req.user.id;
    } else if (req.user.role.name === "Patient") {
      filter.assignedTo = req.user.id;
    } else if (req.user.role.name === "Patient") {
      filter.patient = req.user.id;
    }

    // Apply search filtering (date, patient name, doctor name)
    if (search) {
      filter.$or = [
         
        { "patient.firstName": { $regex: search, $options: "i" } }, // Patient name
        { "patient.lastName": { $regex: search, $options: "i" } },
        { "doctor.firstName": { $regex: search, $options: "i" } }, // Doctor name
        { "doctor.lastName": { $regex: search, $options: "i" } }
      ];
    }

    // Fetch appointments with pagination
    const appointments = await Appointment.find(filter)
      .populate("patient", "firstName lastName")
      .populate("doctor", "firstName lastName")
      .populate("department", "name")
      .skip(skip)
      .limit(limit);

    // Count total records for pagination metadata
    const totalAppointments = await Appointment.countDocuments(filter);

    res.status(200).json({
      appointments,
      currentPage: page,
      totalPages: Math.ceil(totalAppointments / limit),
      totalAppointments,
    });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



/**
 * Update an appointment
 */
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, updates, { new: true });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Emit real-time update event
    if (global.io) {
      global.io.emit("appointmentUpdated", appointment);
    }

    res.status(200).json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete an appointment
 */
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Emit real-time delete event
    if (global.io) {
      global.io.emit("appointmentDeleted", { appointmentId: id });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createAppointment, getAllAppointments, updateAppointment, deleteAppointment };
