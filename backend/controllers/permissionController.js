const Permission = require("../models/Permission");

// Create a new permission (Super Admin only)
const createPermission = async (req, res) => {
    try {
        console.log("Permission body::", req.body);
        const { action, description } = req.body;

        const existingPermission = await Permission.findOne({ action });
        if (existingPermission) {
            console.log("Permission already exists");
            return res.status(400).json({ error: "Permission already exists" });
        }

        const permission = new Permission({ action, description });
        await permission.save();
        console.log("Permission::", permission);

        res.status(201).json({ message: "Permission created successfully.", permission });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to create permission" });
    }
};

// Get all permissions with search & pagination
const getAllPermissions = async (req, res) => {
    try {
        const { search, page = 1, limit = 10000 } = req.query;
        const query = {};

        // If search query exists, filter by action or description
        if (search) {
            query.$or = [
                { action: { $regex: search, $options: "i" } }, // Case-insensitive search
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const totalPermissions = await Permission.countDocuments(query);
        const permissions = await Permission.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({ total: totalPermissions, page, limit, permissions });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to retrieve permissions" });
    }
};

// Get a single permission by ID (Super Admin only)
const getPermissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);
        if (!permission) return res.status(404).json({ error: "Permission not found" });

        res.status(200).json(permission);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to retrieve permission" });
    }
};

// Update a permission (Super Admin only)
const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, description } = req.body;

        // Ensure no duplicate permission actions
        const existingPermission = await Permission.findOne({ action, _id: { $ne: id } });
        if (existingPermission) {
            return res.status(400).json({ error: "A permission with this action already exists." });
        }

        const permission = await Permission.findByIdAndUpdate(id, { action, description }, { new: true });

        if (!permission) return res.status(404).json({ error: "Permission not found" });

        res.status(200).json({ message: "Permission updated successfully", permission });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to update permission" });
    }
};

// Delete a permission (Super Admin only)
const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findByIdAndDelete(id);
        if (!permission) return res.status(404).json({ error: "Permission not found" });

        res.status(200).json({ message: "Permission deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to delete permission" });
    }
};

module.exports = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
};