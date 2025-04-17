const Role = require("../models/Role");
const checkPermission = (requiredPermission) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // ✅ Super Admins bypass all permission checks
    if (req.user.role.name === "Super Admin") {
      return next();
    }

    // 🔎 Normal Staff/Admin permission check
    const role = await Role.findById(req.user.role._id).populate("permissions");
    if (!role) {
      return res.status(403).json({ message: "Role not found. Access denied." });
    }

    const userPermissions = role.permissions.map((perm) => perm.action);
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Insufficient permissions." });
    }

    next();
  } catch (error) {
    console.error("Permission Check Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = checkPermission;
