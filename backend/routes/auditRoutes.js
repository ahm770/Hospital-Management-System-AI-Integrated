const express = require("express");
const { getAuditLogs } = require("../controllers/auditController");
const authenticate = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

// Route to fetch audit logs (Only users with "view_audit_logs" permission)
router.get("/", authenticate, checkPermission("view_audit_logs"), getAuditLogs);

module.exports = router;
