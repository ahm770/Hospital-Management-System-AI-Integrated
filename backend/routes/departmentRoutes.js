const express = require("express");
const { 
  createDepartment, 
  getAllDepartments, 
  getDepartmentById,  
  updateDepartment, 
  deleteDepartment 
} = require("../controllers/departmentController");

const authenticate = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

router.post("/", authenticate, checkPermission("create_department"), createDepartment);
router.get("/", authenticate, checkPermission("view_department"), getAllDepartments);
router.get("/:id", authenticate, checkPermission("view_department"), getDepartmentById); 
router.put("/:id", authenticate, checkPermission("update_department"), updateDepartment);
router.delete("/:id", authenticate, checkPermission("delete_department"), deleteDepartment);

module.exports = router;
