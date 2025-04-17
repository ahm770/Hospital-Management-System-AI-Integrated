const mongoose = require("mongoose");
const Shift = require("../models/Shift");
const User = require("../models/User");
const Department = require("../models/Department");
const notificationService = require("../services/notificationService");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const shiftRules = {
  morning: { start: "08:00 AM", end: "04:00 PM" },
  evening: { start: "04:00 PM", end: "12:00 AM" },
  night: { start: "12:00 AM", end: "08:00 AM" },
};

/**
 * Helper function to extract clean JSON from AI response
 */
const extractJSON = (text) => {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const cleanText = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ JSON Parsing Error:", error);
    return null;
  }
};

/**
 * AI-Powered Shift Assignment using Gemini
 */
const autoAssignShifts = async () => {
  try {
    console.log("🔄 Running AI Shift Scheduler...");

    const departments = await Department.find();
    
    for (const department of departments) {
      const availableStaff = await User.find({ department: department._id, userType: "Staff", isActive: true });

      if (availableStaff.length === 0) {
        console.log(`⚠️ No available staff for department: ${department.name}`);
        continue;
      }

      // Map available staff to valid ObjectIds
      const staffMap = availableStaff.reduce((map, staff) => {
        map[staff._id.toString()] = staff._id;
        return map;
      }, {});

      const pastShifts = await Shift.find({ department: department._id }).sort({ date: -1 }).limit(30);
      const shiftHistory = pastShifts.map(shift => ({
        staffId: shift.staff.toString(),
        date: shift.date,
        type: shift.type,
      }));

      // AI Prompt
      const prompt = `
      You are an AI managing hospital shift scheduling.
      Here is the recent shift history for the ${department.name} department:
      ${JSON.stringify(shiftHistory, null, 2)}

      **TASK:**
      1️⃣ Assign shifts fairly, avoiding back-to-back night shifts.
      2️⃣ Prioritize staff with fewer recent shifts.
      3️⃣ Balance workload across all staff.
      4️⃣ Use only these valid staff IDs: ${Object.keys(staffMap).join(", ")}
      5️⃣ Output **pure JSON** format only.

      Example JSON format:
      [
        {"staffId": "60d5f3b8e3a3a3b8a8b8b8b8", "date": "2025-03-18", "type": "morning"},
        {"staffId": "60d5f3b8e3a3a3b8a8b8b8b9", "date": "2025-03-18", "type": "night"}
      ]
      `;

      // Call Gemini AI for shift assignment
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiAssignments = extractJSON(response.text());
      console.log("aiAssignments::", aiAssignments)

      if (!aiAssignments) {
        throw new Error("AI did not return valid JSON.");
      }

      for (const assignment of aiAssignments) {
        const staffId = staffMap[assignment.staffId]; // Convert AI staffId to valid ObjectId
        if (!staffId) {
          console.warn(`⚠️ AI returned an invalid staff ID: ${assignment.staffId}`);
          continue;
        }

        const existingShift = await Shift.findOne({ staff: staffId, date: assignment.date });
        if (!existingShift) {
          await Shift.create({
            staff: staffId,
            department: department._id,
            date: assignment.date,
            startTime: shiftRules[assignment.type].start,
            endTime: shiftRules[assignment.type].end,
            type: assignment.type,
          });

          console.log(`✅ AI assigned ${assignment.type} shift to staff ID ${staffId} (${department.name})`);
           // **📢 Send notification to staff**
           await notificationService.sendNotification(
            assignment.staffId,  // User ID
            `📢 You have been assigned a ${assignment.type} shift in ${department.name} on ${assignment.date}.`,
            "shift"
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ AI Shift Scheduler Error:", error);
  }
};

module.exports = { autoAssignShifts };
