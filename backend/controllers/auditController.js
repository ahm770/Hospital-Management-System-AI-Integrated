const AuditLog = require("../models/AuditLog");

// @desc    Get audit logs with filters
// @route   GET /api/audit-logs
// @access  Restricted (Super Admins or roles with "view_audit_logs")
const getAuditLogs = async (req, res) => {
  try {
    let { user, entity, startDate, endDate, search, page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10000;
    const skip = (page - 1) * limit;

    const filters = {};

    if (user) filters.performedBy = user;
    if (entity) filters.entity = entity;
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }

    // Search functionality (search within "action" and "description")
    if (search) {
      filters.$or = [
        { action: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch audit logs with pagination and sorting
    const auditLogs = await AuditLog.find(filters)
      .sort({ timestamp: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Count total matching audit logs for pagination
    const totalLogs = await AuditLog.countDocuments(filters);

    res.status(200).json({
      success: true,
      logs: auditLogs,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
      totalLogs,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = { getAuditLogs };
