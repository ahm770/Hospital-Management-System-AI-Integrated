const express = require("express");
const { 
  createTask, 
  getTaskById, 
  getAllTasks, 
  getMyTasks,  // ✅ Added getMyTasks
  updateTask, 
  deleteTask, 
  completeTask 
} = require("../controllers/taskController");

const checkPermission = require("../middlewares/checkPermission");
const authenticate  = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Create Task (Only Doctors, Lab Techs, Pharmacists)
router.post("/", authenticate, checkPermission("create_task"), createTask);

// ✅ Get Tasks Assigned to or Created by the Logged-In User (Should be placed above get task id to prevent cast errors)
router.get("/my", authenticate, getMyTasks); 

// ✅ Get Task by ID (Requires "view_task" Permission)
router.get("/:id", authenticate, checkPermission("view_task"), getTaskById);

// ✅ Get All Tasks (Search, Pagination, Filtering) (Requires "view_task" Permission)
router.get("/", authenticate, checkPermission("view_task"), getAllTasks); 

// ✅ Update Task (Only Task Creator/Admin)
router.put("/:id", authenticate, checkPermission("update_task"), updateTask);

// ✅ Delete Task (Only Task Creator/Admin)
router.delete("/:id", authenticate, checkPermission("delete_task"), deleteTask);

// ✅ Complete Task (Only Assigned User)
router.put("/:id/complete", authenticate, completeTask);

module.exports = router;
