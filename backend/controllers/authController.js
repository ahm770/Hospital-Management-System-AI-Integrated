const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Staff = require("../models/Staff");
const Role = require("../models/Role");
const Permission = require("../models/Permission");  
const BlacklistedToken = require("../models/BlacklistedToken");

const Department = require("../models/Department")
const logger = require("../utils/logger");
 
const register = async (req, res) => {
    try {
        logger.silly(`body::: ${JSON.stringify(req.body)}`);

        const { firstName, lastName, email, password, phone, address, gender, userType, role, department, dob } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;

        if (userType === "Patient") {
             // Validate patient role
             const p_role = await Role.findOne({ name:"Patient"}).populate("permissions");
             if (!role) {
                 return res.status(400).json({ message: "Invalid patient role." });
             }
            newUser = new Patient({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                address,
                gender,
                dob,
                role: p_role._id,
            });

        } else if (userType === "Staff") {
            if (!role || !department) {
                return res.status(400).json({ message: "Staff role and department are required for staff registration." });
            }

            // Validate staff role
            const role = await Role.findOne({ name: role }).populate("permissions");
            if (!role) {
                return res.status(400).json({ message: "Invalid staff role." });
            }

            // Validate department
            const departmentDoc = await Department.findOne({ name: department });
            if (!departmentDoc) {
                logger.error("Invalid department.");
                return res.status(400).json({ message: "Invalid department." });
            }

            newUser = new Staff({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
                address,
                gender,
                dob,
                role: role._id,
                department: departmentDoc._id
            });
        } else {
            return res.status(400).json({ message: "Invalid user type. Must be 'Patient' or 'Staff'." });
        }

        await newUser.save();

        // Populate role and department for staff & remove sensitive fields
        if (userType === "Staff") {
            newUser = await Staff.findById(newUser._id)
                .populate("role", "name")
                .populate("department", "name")
                .select("-password -__v")
                .lean();
        } else {
            newUser = await Patient.findById(newUser._id)
                .select("-password -__v -medicalRecords") // Exclude medicalRecords
                .lean();
        }

        res.status(201).json({ message: "User registered successfully.", user: newUser });

    } catch (error) {
        logger.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

  
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and populate roles based on userType
        const user = await User.findOne({ email })
            .populate({
                path: "role",
                select: "name",
                options: { strictPopulate: false }, // Avoid errors for Patients
            })
            .populate({
                path: "department",
                select: "name",
                options: { strictPopulate: false }, // Avoid errors for Patients
            })
           

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Remove sensitive data
        const sanitizedUser = user.toObject();
        delete sanitizedUser.password;
        delete sanitizedUser.__v;

        // If the user is a patient, remove staff-specific fields
        if (sanitizedUser.userType === "Patient") {
            delete sanitizedUser.role;
            delete sanitizedUser.department;
        }

        res.json({ message: "Login successful.", token, user: sanitizedUser });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




const getProfile = async (req, res) => {
    try {
      let user = req.user;
  
      if (user.userType === "Staff") {
        user = await user.populate({
          path: "role department",
          select: "name", // Only fetch the role/department name
        });
      }
  
      // Filter out sensitive fields
      const { password, resetToken, __v, createdAt, updatedAt, ...safeUserData } = user.toObject();
  
      res.status(200).json(safeUserData);
    } catch (error) {
      console.error("Profile Error:", error);
      res.status(500).json({ message: "Internal Server Error." });
    }
  };
  
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

        if (!token) {
            return res.status(400).json({ message: "No token provided." });
        }

        // Decode token to get expiration time
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiresAt = new Date(decoded.exp * 1000); // Convert to Date object

        // Store token in blacklist
        await new BlacklistedToken({ token, expiresAt }).save();

        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        logger.error("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}; 

const resetPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Verify the old password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        // Prevent reuse of the same password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: "New password cannot be the same as the old password." });
        }

        // Hash and update the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.forcePasswordReset = false; // Allow login after reset
        await user.save();

        res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        logger.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


module.exports = { register, login, getProfile, logout, resetPassword };
