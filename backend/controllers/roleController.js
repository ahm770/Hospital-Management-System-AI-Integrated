const Role = require("../models/Role");
const Permission = require("../models/Permission");

/**
 * Create a new role
 */
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Validate permissions
    const validPermissions = await Permission.find({ _id: { $in: permissions } });
    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({ message: "Invalid permissions provided." });
    }

    const newRole = new Role({ name, permissions });
    await newRole.save();

    res.status(201).json({ message: "Role created successfully.", role: newRole });
  } catch (error) {
    console.error("Create Role Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update an existing role
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("role body update::", req.body, id)
    const { name, permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    // Validate permissions
    const validPermissions = await Permission.find({ _id: { $in: permissions } });
    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({ message: "Invalid permissions provided." });
    }

    role.name = name;
    role.permissions = permissions;
    await role.save();

    res.status(200).json({ message: "Role updated successfully.", role });
  } catch (error) {
    console.error("Update Role Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete a role
 */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    await Role.findByIdAndDelete(id);
    res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    console.error("Delete Role Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Get a specific role by ID
 */
const getRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id).populate("permissions", "action description");
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    res.status(200).json({ role });
  } catch (error) {
    console.error("Get Role Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Get all roles with pagination and search
 */
const getAllRoles = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10000;
    const skip = (page - 1) * limit;

    // Search filter (if search query is provided)
    const filter = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    const roles = await Role.find(filter)
      .populate("permissions", "action description")
      .skip(skip)
      .limit(limit);

    const totalRoles = await Role.countDocuments(filter);

    res.status(200).json({
      roles,
      currentPage: page,
      totalPages: Math.ceil(totalRoles / limit),
      totalRoles,
    });
  } catch (error) {
    console.error("Get Roles Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createRole, updateRole, deleteRole, getRole, getAllRoles };
