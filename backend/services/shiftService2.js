const Shift = require("../models/Shift");
const User = require("../models/User");
const Department = require("../models/Department");
const notificationService = require("../services/notificationService");

// Shift configuration rules
const shiftRules = {
  morning: { start: "08:00 AM", end: "04:00 PM" },
  evening: { start: "04:00 PM", end: "12:00 AM" },
  night: { start: "12:00 AM", end: "08:00 AM" },
};

/**
 * Auto-assign shifts based on available staff and department workload.
 */
const autoAssignShifts = async () => {
  try {
    console.log("🔄 Running AI Shift Scheduler...");

    // Get all departments
    const departments = await Department.find();
    
    for (const department of departments) {
      // Get available staff in the department
      const availableStaff = await User.find({ department: department._id, userType: "Staff", isActive: true });

      if (availableStaff.length === 0) {
        console.log(`⚠️ No available staff for department: ${department.name}`);
        continue;
      }

      // Distribute staff across shifts
      const shifts = Object.keys(shiftRules);
      for (let i = 0; i < availableStaff.length; i++) {
        const staff = availableStaff[i];
        const shiftType = shifts[i % shifts.length]; // Rotate between morning, evening, and night

        const existingShift = await Shift.findOne({ staff: staff._id, date: new Date().toISOString().split("T")[0] });
        if (!existingShift) {
          // Create new shift
          const shift = await Shift.create({
            staff: staff._id,
            department: department._id,
            date: new Date().toISOString().split("T")[0], // Today's date
            startTime: shiftRules[shiftType].start,
            endTime: shiftRules[shiftType].end,
            type: shiftType,
          });

          console.log(`✅ Assigned ${shiftType} shift to ${staff.firstName} ${staff.lastName} (${department.name})`);
          
          await notificationService.sendNotification(
            staff._id,  // Pass only the userId
            `You have been assigned a ${shiftType} shift in ${department.name}.`,
            "shift"
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in AI Shift Scheduler:", error);
  }
};

/**
 * React dynamically to real-time staff availability changes.
 */
const handleStaffAvailabilityChange = async (staffId, isAvailable) => {
  try {
    console.log(`🔄 Updating shifts for staff: ${staffId}, Available: ${isAvailable}`);

    if (!isAvailable) {
      // Remove upcoming shifts for unavailable staff
      await Shift.deleteMany({ staff: staffId, status: "scheduled" });
      console.log(`🚫 Removed future shifts for unavailable staff: ${staffId}`);
    } else {
      // Re-run shift assignment for the department
      await autoAssignShifts();
    }
  } catch (error) {
    console.error("❌ Error handling staff availability change:", error);
  }
};

module.exports = { autoAssignShifts, handleStaffAvailabilityChange };
