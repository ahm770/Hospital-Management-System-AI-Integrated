const Staff = require("../models/Staff");
const User = require("../models/User");
const Role = require("../models/Role");
const Department = require("../models/Department");
const bcrypt = require("bcryptjs");

/**
 * Create a new staff member
 */
const createStaff = async (req, res) => {
  try {
    console.log("body::", req.body)
    const { firstName, lastName, email, phone, dob, address, gender, role, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Staff member already exists." });
    }
   // Prevent non-Super Admins from creating another Super Admin
   const _role = await Role.findOne({ name: role }).populate("permissions");
   if (!_role) return res.status(400).json({ message: "Invalid staff role." });

   if (_role.name === "Super Admin" && req.user.role.name !== "Super Admin") {
     return res.status(403).json({ message: "Only Super Admins can create Super Admins." });
   }
    // Use email as default password for reset later
    const defaultPassword = email;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Validate department
    const departmentDoc = await Department.findOne({ name: department });
    if (!departmentDoc) return res.status(400).json({ message: "Invalid department." });

    // Create staff user
    let newUser = new Staff({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      gender,
      userType: "Staff",
      dob,
      role: _role._id,
      department: departmentDoc._id,
      isActive: true,
      forcePasswordChange: true, // Force password change on first login
      createdBy: req.user.id, // Track who created the patient

    });

    await newUser.save();

    newUser = await Staff.findById(newUser._id)
      .populate("role", "name")
      .populate("department", "name")
      .select("-password -__v")
      .lean();

    res.status(201).json({
      message: "Staff member created successfully. Default password has been set.",
      staff: newUser,
    });
  } catch (error) {
    console.log("error::", error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Update staff details
 */
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, department, ...updateData } = req.body;
    
    console.log("body::", req.body);

    let staff = await Staff.findById(id).populate("role", "name").populate("department", "name");
    if (!staff) return res.status(404).json({ message: "Staff not found." });

    // Check if email is being updated and if it's already taken
    if (email && email !== staff.email) {
      const emailExists = await Staff.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use by another staff member." });
      }
      updateData.email = email;
    }

    // Prevent Admins from modifying Super Admins
    if (staff.role.name === "Super Admin" && req.user.role.name !== "Super Admin") {
      return res.status(403).json({ message: "You cannot modify a Super Admin." });
    }

    // Update staff role if provided
    if (role) {
      const newRole = await Role.findById(role);
      if (!newRole) return res.status(400).json({ message: "Invalid role." });

      if (newRole.name === "Super Admin" && req.user.role.name !== "Super Admin") {
        return res.status(403).json({ message: "Only Super Admins can assign Super Admin roles." });
      }
      updateData.role = newRole._id;
    }

    // Update department if provided
    if (department) {
      const newDepartment = await Department.findById(department);
      if (!newDepartment) return res.status(400).json({ message: "Invalid department." });

      updateData.department = newDepartment._id;
    }

    // Apply updates
    Object.assign(staff, updateData);
    await staff.save();

    // Refetch updated staff with populated fields
    staff = await Staff.findById(id)
      .populate("role", "name")
      .populate("department", "name");

    res.status(200).json({ message: "Staff updated successfully.", staff });
  } catch (error) {
    console.log("error::", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Delete staff
 */
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    let staff = await Staff.findById(id).populate("role", "name");

    if (!staff) return res.status(404).json({ message: "Staff not found." });

    // Prevent Admins from deleting Super Admins
    if (staff.role.name === "Super Admin" && req.user.role.name !== "Super Admin") {
      return res.status(403).json({ message: "You cannot delete a Super Admin." });
    }

    await staff.deleteOne();
    res.status(200).json({ message: "Staff deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Get all staff members with pagination and search
 */
const getAllStaff = async (req, res) => {
  try {
    let filter = {};

    // Restrict non-Super Admin users from seeing Super Admins
    if (req.user.role.name !== "Super Admin") {
      const superAdminRole = await Role.findOne({ name: "Super Admin" });
      if (superAdminRole) filter.role = { $ne: superAdminRole._id };
    }

    // Pagination parameters
    let { page, limit, search, department } = req.query;
    console.log("got dep::", department)
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10000;
    const skip = (page - 1) * limit;

    // Add search filter (search by name, email, or phone)
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Add department filter if provided
    if (department) {
      filter.department = department; // Assuming department is the ObjectId
    }

    // Fetch paginated staff list
    const staff = await Staff.find(filter)
      .populate("department", "name")
      .populate("role", "name")
      .select("-password -__v")
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalStaff = await Staff.countDocuments(filter);
    
    res.status(200).json({
      staff,
      currentPage: page,
      totalPages: Math.ceil(totalStaff / limit),
      totalStaff,
    });
  } catch (error) {
    console.error("Get All Staff Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = { createStaff, updateStaff, deleteStaff, getAllStaff };
