const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");

const authenticateUser = async (req, res, next) => {
  try {
    // Check if token is provided
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Bearer header
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
       // Check if token is blacklisted
       const isBlacklisted = await BlacklistedToken.findOne({ token });
       if (isBlacklisted) {
           return res.status(403).json({ message: "Token is invalid. Please log in again." });
       }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password").populate("role"); // Attach user data to request

    if (!req.user) {
      return res.status(401).json({ message: "Invalid token. User not found." });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Invalid token. Please authenticate." });
  }
};

module.exports = authenticateUser;
