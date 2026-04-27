const asyncHandler = require("express-async-handler");
const adminModel = require("../../model/admin.model");
const bcrypt = require("bcryptjs");

// Admin Signup
const adminSignUp = asyncHandler(async (req, res) => {
    try {
        const { admin_email, admin_password } = req.body;
        
        if (!admin_email || !admin_password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ admin_email }).exec();
        if (existingAdmin) {
            return res.status(403).json({ message: "Admin already registered" });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(admin_password, bcrypt.genSaltSync(10));

        // Create admin
        const newAdmin = await adminModel.create({
            admin_email,
            admin_password: hashedPassword,
        });

        return res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error("Admin Signup Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

module.exports =  adminSignUp ;

