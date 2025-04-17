require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken"); 
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const setupSocket = require("./services/socketService").setupSocket;
const logger = require('./utils/logger');  
const shiftService = require("./services/shiftService");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const patientRoutes = require("./routes/patientRoutes");
const staffRoutes = require("./routes/staffRoutes");
const auditRoutes = require("./routes/auditRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const roleRoutes = require("./routes/roleRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const permissionRoutes = require("./routes/permissionRoutes")
const shiftRoutes = require("./routes/shiftRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const socketMiddleware = require("./middlewares/socketMiddleware");

// Initialize Express app
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://[::1]:3000",
    "https://didactic-couscous-g476qrwr9p5jhgp9-3000.app.github.dev"
  ],
  credentials: true,
  preflightContinue: false,
  optionSuccessStatus: 200
};
const io = new Server(server, {
    cors: corsOptions, // Apply corsOptions to Socket.IO
});

// Connect to database
connectDB();

// Run AI shift scheduler on server startup
setTimeout(() => shiftService.autoAssignShifts(), 5000);

// Authentication middleware for Socket.IO
io.use(socketMiddleware)
 
// Setup WebSockets
setupSocket(io);



// Socket.IO Error Handling
io.on("connect_error", (err) => {
  logger.error(`Socket.IO connect_error: ${err.message}`);
});

io.on("connection", (socket) => {
  logger.info(`🔌 User connected: ${socket.id}, UserID: ${socket.user?.id}`);

   
});

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

// Global Error Handler
app.use(require('./middlewares/errorHandler'));

app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the Hospital Management System API!"
      
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { app, io };