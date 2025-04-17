const Shift = require("../models/Shift");
const User = require("../models/User");
const { sendNotification } = require("../services/notificationService");

/**
 * ✅ Assign a Shift (Admin only)
 */
const assignShift = async (req, res) => {
  try {
    const { staff, department, date, startTime, endTime, type } = req.body;

    // 🔍 Check if staff exists
    const staffMember = await User.findById(staff);
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // ⛔ Prevent Overlapping Shifts
    const existingShift = await Shift.findOne({
      staff,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Time overlap check
      ],
    });

    if (existingShift) {
      return res.status(400).json({ message: "Shift overlaps with an existing shift." });
    }

    // 📝 Create shift
    const shift = new Shift({
      staff,
      department,
      date,
      startTime,
      endTime,
      type,
      status: "scheduled",
    });

    await shift.save();

    // 📢 Send Notification to Staff
    await sendNotification(
      staff,
      `📢 You have been assigned a ${type} shift on ${date}.`,
      "system"
    );

    res.status(201).json({ message: "Shift assigned successfully", shift });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 📌 Get All Shifts (Filter by Date, Staff, Department)
 */
 
const getShifts = async (req, res) => {
  try {
    let { date, staff, department, search, page, limit, sortBy, sortOrder } = req.query;
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10000;
    const skip = (page - 1) * limit;

    let query = {};

    if (date) query.date = date;
    if (staff) query.staff = staff;
    if (department) query.department = department;

    // Search functionality (search in staff name or department name)
    if (search) {
      query.$or = [
        { "staff.firstName": { $regex: search, $options: "i" } },
        { "staff.lastName": { $regex: search, $options: "i" } },
        { "department.name": { $regex: search, $options: "i" } },
      ];
    }

    // Sorting Logic
    let sortOptions = { date: 1 }; // Default sorting by earliest date
    if (sortBy) {
      sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    // Fetch shifts with pagination and sorting
    const shifts = await Shift.find(query)
      .populate("staff", "firstName lastName")
      .populate("department", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Count total matching shifts for pagination
    const totalShifts = await Shift.countDocuments(query);

    res.status(200).json({
      success: true,
      shifts,
      currentPage: page,
      totalPages: Math.ceil(totalShifts / limit),
      totalShifts,
    });
  } catch (error) {
    console.error("Error fetching shifts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ✅ Get Shifts for the Logged-in Staff Member (With Sorting)
 */
const getMyShifts = async (req, res) => {
  try {
    const staffId = req.user.id; // Get logged-in user's ID
    let { date, search, page, limit, sortBy, sortOrder } = req.query;
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10000;
    const skip = (page - 1) * limit;

    let query = { staff: staffId };

    if (date) query.date = date; // Filter by specific date

    // Search functionality (search in department name)
    if (search) {
      query.$or = [{ "department.name": { $regex: search, $options: "i" } }];
    }

    // Sorting Logic
    let sortOptions = { date: 1 }; // Default sorting by earliest date
    if (sortBy) {
      sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    // Fetch shifts with pagination & sorting
    const shifts = await Shift.find(query)
      .populate("staff", "firstName lastName")
      .populate("department", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Count total matching shifts
    const totalShifts = await Shift.countDocuments(query);

    res.status(200).json({
      success: true,
      shifts,
      currentPage: page,
      totalPages: Math.ceil(totalShifts / limit),
      totalShifts,
    });
  } catch (error) {
    console.error("Error fetching user shifts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * 🛠️ Update Shift (Reschedule or Cancel)
 */
const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, type, status } = req.body;

    const shift = await Shift.findById(id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    // Prevent overlap when rescheduling
    if (date || startTime || endTime) {
      const overlappingShift = await Shift.findOne({
        staff: shift.staff,
        date: date || shift.date,
        $or: [
          { startTime: { $lt: endTime || shift.endTime }, endTime: { $gt: startTime || shift.startTime } },
        ],
        _id: { $ne: shift._id },
      });

      if (overlappingShift) {
        return res.status(400).json({ message: "Rescheduled shift overlaps with another shift." });
      }
    }

    if (date) shift.date = date;
    if (startTime) shift.startTime = startTime;
    if (endTime) shift.endTime = endTime;
    if (type) shift.type = type;
    if (status) shift.status = status;

    await shift.save();

    // 📢 Notify Staff about the update
    await sendNotification(
      shift.staff,
      `📢 Your shift on ${shift.date} has been updated.`,
      "system"
    );

    res.json({ message: "Shift updated successfully", shift });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * ❌ Delete Shift (Cancel)
 */
const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;

    const shift = await Shift.findById(id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    await Shift.deleteOne({ _id: id });

    // 📢 Notify Staff about Cancellation
    await sendNotification(
      shift.staff,
      `⚠️ Your shift on ${shift.date} has been canceled.`,
      "system"
    );

    res.json({ message: "Shift canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  assignShift,
  getShifts,
  getMyShifts,  
  updateShift,
  deleteShift,
};
