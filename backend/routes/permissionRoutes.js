const express = require("express");
const { 
    createPermission, 
    getAllPermissions, 
    getPermissionById, 
    updatePermission, 
    deletePermission 
} = require("../controllers/permissionController");

const authenticate = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

router.post("/", authenticate, checkPermission("create_permission"), createPermission);
router.get("/", authenticate, checkPermission("view_permission"), getAllPermissions);
router.get("/:id", authenticate, checkPermission("view_permission"), getPermissionById);
router.put("/:id", authenticate, checkPermission("update_permission"), updatePermission);
router.delete("/:id", authenticate, checkPermission("delete_permission"), deletePermission);

module.exports = router;
