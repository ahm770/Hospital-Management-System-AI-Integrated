const express = require("express");
const { register, login, getProfile, logout, resetPassword } = require("../controllers/authController");
const authenticate  = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route - Only Authenticated Users
router.get("/profile", authenticate , getProfile);
router.post("/reset-password",  authenticate, resetPassword);
router.post("/logout",  authenticate, logout);
module.exports = router;
