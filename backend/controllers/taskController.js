const Task = require("../models/Task");
const Staff = require("../models/Staff");
const Role = require("../models/Role");
const checkPermission = require("../middlewares/checkPermission");
const { sendNotification } = require("../services/notificationService");

const createTask = async (req, res) => {
  console.log("In createTask", req.user);
  try {
    const { title, description, assignedTo, type, priority } = req.body; // assignedTo is actually the patient ID

    // ✅ Validate Task Type
    const validTypes = [ "medical_record", "discharge", "prescription"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid task type." });
    }

    // ✅ Ensure Only Doctors Can Create Certain Tasks
    if ((type === "medical_record" || type === "discharge" || type === "prescription" || type === "discharge" || type === "lab_test") && req.user.role.name !== "Doctor") {
      return res.status(403).json({ message: `Only doctors can create ${type} tasks.` });
    }

    // ✅ Ensure Patient ID (assignedTo) is Provided for Medical Record & Discharge
    if (!assignedTo) {
      return res.status(400).json({ message: "Patient ID is required for this task type." });
    }

    let finalAssignedTo = null;

     
      // Get the Doctor's Department
      const doctor = await Staff.findById(req.user.id).populate("department");
      if (!doctor || !doctor.department) {
        return res.status(400).json({ message: "Doctor does not belong to any department." });
      }

    // Get the Nurse role ID
const nurseRole = await Role.findOne({ name: "Nurse" });  
if (!nurseRole) {
  return res.status(500).json({ message: "Nurse role not found." });
}

  // Find an available Nurse in the same department
  const nurse = await Staff.findOne({
    role: nurseRole._id,  
    department: doctor.department._id,
    isActive: true,
  }).sort({ tasksAssigned: 1 }); // Assign to the least busy nurse

  if (!nurse) {
    return res.status(404).json({ message: "No available nurses in this department." });
  }

  finalAssignedTo = nurse._id; // ✅ Assign task to this nurse
    

    // ✅ Create the Task
    const task = new Task({
      title,
      description,
      assignedTo: finalAssignedTo, // Nurse's ID or manually assigned staff
      createdBy: req.user.id,
      type,
      priority: priority || "medium",
      status: "pending",
      patient: assignedTo, // Store patient ID correctly
    });

    await task.save();

    // ✅ Send Notification to Assigned Staff (Nurse or Assigned Staff)
    await sendNotification(finalAssignedTo, `You have a new task: ${title}`, "task");

    // ✅ Emit WebSocket Event
    if (global.io) {
      global.io.to(finalAssignedTo.toString()).emit("newTask", {
        message: "You have a new task",
        taskId: task._id,
      });
    }

    res.status(201).json({ success: true, message: "Task created and assigned", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("assignedTo", "name email").populate("createdBy", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ Check "view_task" Permission
    if (!checkPermission(req.user, "view_task")) {
      return res.status(403).json({ message: "Unauthorized to view this task" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get All Tasks (Search, Pagination, Filtering)
const getAllTasks = async (req, res) => {
  try {
    let { search, status, page, limit, sortBy, sortOrder } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    // Sorting (default: newest first)
    let sortOptions = { createdAt: -1 };
    if (sortBy) {
      sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "firstName lastName") // Populate assignedTo
      .populate("createdBy", "firstName lastName ") // Populate createdBy
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Task (Only Task Creator/Admin)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ Ensure Only Creator/Admin Can Update Task
    if (task.createdBy.toString() !== req.user.id && !checkPermission(req.user, "update_task")) {
      return res.status(403).json({ message: "Unauthorized to update this task" });
    }

    Object.assign(task, updates);
    await task.save();

    res.status(200).json({ success: true, message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}; 

// ✅ Delete Task (Only Task Creator/Admin)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ Ensure Only Creator/Admin Can Delete Task
    if (task.createdBy.toString() !== req.user.id && !checkPermission(req.user, "delete_task")) {
      return res.status(403).json({ message: "Unauthorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Complete Task (Only Assigned User)
const completeTask = async (req, res) => {
  console.log("in complete task")
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ Ensure Only Assigned User Completes the Task
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to complete this task" });
    }

    task.status = "completed";
    await task.save();

    // ✅ Send Notification to Task Creator
    await sendNotification(task.createdBy.toString(), `Task "${task.title}" has been completed.`, "task");

    // ✅ Emit WebSocket Event
    if (global.io) {
      global.io.to(task.createdBy.toString()).emit("taskCompleted", {
        message: "A task has been completed",
        taskId: task._id,
      });
    }

    res.status(200).json({ success: true, message: "Task marked as completed", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Tasks Assigned to or Created by the Logged-In User
const getMyTasks = async (req, res) => {
  try {
    console.log("mytasks query::", req.query);
    let { search, status, page, limit, sortBy, sortOrder } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { assignedTo: req.user.id }, // Tasks assigned to the user
        { createdBy: req.user.id },  // Tasks created by the user
      ],
    };

    if (status) query.status = status;

    if (search) {
      query.$or.push(
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      );
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "firstName lastName") // Populate assignedTo
      .populate("createdBy", "firstName lastName ") // Populate createdBy
      .sort({ [sortBy || "createdAt"]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(query);

    res.status(200).json({
      message: "Tasks retrieved successfully.",
      tasks,
      totalTasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    console.error("Get My Tasks Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { createTask, getTaskById, getAllTasks,  getMyTasks, updateTask, deleteTask, completeTask };
