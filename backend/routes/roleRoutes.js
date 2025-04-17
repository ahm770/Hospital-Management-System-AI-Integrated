const express = require("express");
const {
  createRole,
  updateRole,
  deleteRole,
  getRole,
  getAllRoles
} = require("../controllers/roleController");
const authenticate = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

router.post("/", authenticate, checkPermission("assign_role"), createRole);
router.put("/:id", authenticate, checkPermission("update_role"), updateRole);
router.delete("/:id", authenticate, checkPermission("delete_role"), deleteRole);
router.get("/:id", authenticate, checkPermission("view_role"), getRole)
router.get("/", authenticate, checkPermission("view_role"), getAllRoles);

module.exports = router;
