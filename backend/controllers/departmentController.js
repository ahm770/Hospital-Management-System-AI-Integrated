const Department = require("../models/Department");

// Create a new department (Super Admin only)
const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const department = new Department({ name, description });
        await department.save();
        res.status(201).json({ message: "Department created successfully", department });
    } catch (error) {
        res.status(500).json({ error: "Failed to create department" });
    }
};

// Get all departments (Admins & Super Admins)
const getAllDepartments = async (req, res) => {
    try {
        let { page, limit, search } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10000;
        const skip = (page - 1) * limit;

        let filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" }; // Case-insensitive search by department name
        }

        const departments = await Department.find(filter).skip(skip).limit(limit);
        const totalDepartments = await Department.countDocuments(filter);

        res.status(200).json({
            departments,
            currentPage: page,
            totalPages: Math.ceil(totalDepartments / limit),
            totalDepartments,
        });
    } catch (error) {
        console.error("Get Departments Error:", error);
        res.status(500).json({ error: "Failed to retrieve departments" });
    }
};

// Update a department (Super Admin only)
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Check if another department with the same name exists
        const existingDepartment = await Department.findOne({ name: { $regex: `^${name}$`, $options: "i" }, _id: { $ne: id } });
        if (existingDepartment) {
            return res.status(400).json({ error: "Another department with this name already exists" });
        }

        const department = await Department.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!department) return res.status(404).json({ error: "Department not found" });

        res.status(200).json({ message: "Department updated successfully", department });
    } catch (error) {
        console.error("Update Department Error:", error);
        res.status(500).json({ error: "Failed to update department" });
    }
};

// Delete a department (Super Admin only)
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findByIdAndDelete(id);
        if (!department) return res.status(404).json({ error: "Department not found" });

        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete department" });
    }
};

// Get a single department by ID
const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findById(id);
        if (!department) return res.status(404).json({ error: "Department not found" });

        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve department" });
    }
};


module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};