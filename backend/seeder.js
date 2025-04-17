require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Staff = require("./models/Staff");
const Permission = require("./models/Permission");
const Role = require("./models/Role");
const Department = require("./models/Department");
const Patient = require("./models/Patient");
const Appointment = require("./models/Appointment");
const Notification = require("./models/Notification");
const Task = require("./models/Task");
const Shift = require("./models/Shift");
const AuditLog = require("./models/AuditLog");
const MedicalRecord = require("./models/MedicalRecord");
const BlacklistedToken = require("./models/BlacklistedToken");

// Define Super Admin Credentials
const SUPER_ADMIN_EMAIL = "admin@hospital.com";
const SUPER_ADMIN_PASSWORD = "Admin@123"; // Change this for production

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("🌱 Seeding database...");

    // Clear existing data
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await Department.deleteMany({});
    await Staff.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Notification.deleteMany({});
    await Task.deleteMany({});
    await AuditLog.deleteMany({});
    await Shift.deleteMany({});
    await MedicalRecord.deleteMany({});
    await BlacklistedToken.deleteMany({});
    console.log("✅ Old data cleared");

    // Insert new permissions
    const permissionsData = [
      // 🏥 Appointments Management
      { action: "create_appointment", description: "Can create appointments" },
      { action: "update_appointment", description: "Can update/confirm appointments" },
      { action: "delete_appointment", description: "Can delete appointments" },
      { action: "view_appointment", description: "Can view appointments" },
    
      // 👥 Staff Management
      { action: "create_staff", description: "Can create staff accounts" },
      { action: "update_staff", description: "Can update staff details" },
      { action: "delete_staff", description: "Can delete staff accounts" },
      { action: "view_staff", description: "Can view staff profiles" },
    
      // 🏥 Patient Management
      { action: "create_patient", description: "Can register new patients" },
      { action: "update_patient", description: "Can update patient information" },
      { action: "delete_patient", description: "Can delete patient records" },
      { action: "view_patient", description: "Can view patient details" },
    
      // 🕒 Shift Management
      { action: "create_shift", description: "Can assign staff shifts" },
      { action: "update_shift", description: "Can update staff shifts" },
      { action: "delete_shift", description: "Can delete staff shifts" },
      { action: "view_shift", description: "Can view staff shifts" },
    
      // 📋 Medical Records
      { action: "create_medical_record", description: "Can create medical records" },
      { action: "update_medical_record", description: "Can update medical records" },
      { action: "delete_medical_record", description: "Can delete medical records" },
      { action: "view_medical_record", description: "Can view medical records" },
    
      // 🔑 Admin Management
      { action: "create_admin", description: "Can create admin accounts" },
      { action: "update_admin", description: "Can update admin details" },
      { action: "delete_admin", description: "Can delete admin accounts" },
      { action: "view_admin", description: "Can view admin profiles" },
    
      // 🎭 Role Management
      { action: "assign_role", description: "Can assign roles to staff" },
      { action: "update_role", description: "Can update roles" },
      { action: "delete_role", description: "Can delete roles" },
      { action: "view_role", description: "Can view all roles and permissions" },
    
      // 🛡️ Permission Management
      { action: "create_permission", description: "Can create new permissions" },
      { action: "update_permission", description: "Can update existing permissions" },
      { action: "delete_permission", description: "Can delete permissions" },
      { action: "view_permission", description: "Can view all permissions" },
    
      // 📜 Audit Logs
      { action: "view_audit_logs", description: "Can view system audit logs" },
    
      // 🏢 Department Management
      { action: "create_department", description: "Can create departments" },
      { action: "update_department", description: "Can update departments" },
      { action: "delete_department", description: "Can delete departments" },
      { action: "view_department", description: "Can view all departments" },
    
      // ✅ Task Management
      { action: "create_task", description: "Can create new tasks" },
      { action: "update_task", description: "Can update existing tasks" },
      { action: "delete_task", description: "Can delete tasks" },
      { action: "view_task", description: "Can view all tasks" },

    ];
    
    
    const createdPermissions = await Permission.insertMany(permissionsData);
    console.log(`✅ Inserted ${createdPermissions.length} permissions`);

    // Map actions to permission IDs
    const permissionMap = {};
    createdPermissions.forEach((perm) => {
      permissionMap[perm.action] = perm._id;
    });

    // Insert roles
    const rolesData = [
      {
        name: "Super Admin",
        permissions: [
          "view_audit_logs",
          "create_permission", "update_permission", "delete_permission", "view_permission",
          "create_admin", "update_admin", "delete_admin", "view_admin",
          "assign_role", "update_role", "delete_role", "view_role",
          "create_staff", "update_staff", "delete_staff", "view_staff",
          "create_patient", "update_patient", "delete_patient", "view_patient",
          "create_appointment", "update_appointment", "delete_appointment", "view_appointment",
          "create_medical_record", "update_medical_record", "delete_medical_record", "view_medical_record",
          "create_department", "update_department", "delete_department", "view_department",
          "create_shift", "update_shift", "delete_shift", "view_shift", 
          "create_task", "view_task", "update_task", "delete_task"
        ]
      },
      {
        name: "Admin",
        permissions: [
          "create_staff", "update_staff", "view_staff",
          "create_patient", "update_patient", "view_patient",
          "create_appointment", "update_appointment", "view_appointment",
          "view_department",
          "create_shift", "update_shift", "view_shift",
          "create_task", "view_task", "update_task"
        ]
      },
      {
        name: "Doctor",
        permissions: [
          "create_appointment", "update_appointment", "view_appointment", "view_patient",
          "create_medical_record", "update_medical_record", "view_medical_record",
          "create_task", "view_task", "update_task", 
        ]
      },
      {
        name: "Nurse",
        permissions: [
          "update_medical_record", "view_medical_record",  
          "view_patient"
        ]
      },
      {
        name: "Receptionist",
        permissions: [
          "create_appointment", "view_appointment", "update_appointment",
          "create_patient", "view_patient", "update_patient", "view_staff", "view_department",
           
       
        ]
      },
      {
        name: "Patient",
        permissions: [
          "create_appointment", "view_appointment", "update_appointment",
          "view_medical_record"
       
        ]
      }  
    
    ];
    
    
    
    const rolesWithPermissions = rolesData.map((role) => ({
      name: role.name,
      permissions: role.permissions.map((action) => permissionMap[action])
    }));
    const createdRoles = await Role.insertMany(rolesWithPermissions);
    console.log(`✅ Inserted ${createdRoles.length} staff roles`);

    // Insert departments
    const departmentsData = [
      { name: "Admin", description: "Handles administrative tasks and hospital management" },
      { name: "Cardiology", description: "Focuses on heart-related conditions and treatments" },
      { name: "Neurology", description: "Deals with disorders of the nervous system" },
      { name: "Radiology", description: "Responsible for imaging and diagnostic procedures" },
      { name: "Pediatrics", description: "Specializes in medical care for children" },
      { name: "Pathology/Laboratory", description: "Handles medical tests and diagnostics" }
    
    ];
    const createdDepartments = await Department.insertMany(departmentsData);
    console.log(`✅ Inserted ${createdDepartments.length} departments`);

    // Find Admin Role and Department
    const adminRole = createdRoles.find((role) => role.name === "Super Admin");
    const adminDepartment = createdDepartments.find((dept) => dept.name === "Admin");

    if (!adminRole || !adminDepartment) {
      throw new Error("Super Admin role or department not found.");
    }

    // Check if Super Admin exists
    const existingAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });
    if (!existingAdmin) {
      // Create Super Admin User
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
      const superAdmin = new Staff({
        firstName: "Super",
        lastName: "Admin",
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        phone: "123456789",
        address: "Main Hospital Building",
        gender: "Other",
        userType: "Staff",
        role: adminRole._id,
        department: adminDepartment._id
      });

      await superAdmin.save();
      console.log("✅ Super Admin user created successfully.");
    } else {
      console.log("⚠️ Super Admin user already exists. Skipping creation.");
    }

    console.log("🎉 Database seeding completed!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();