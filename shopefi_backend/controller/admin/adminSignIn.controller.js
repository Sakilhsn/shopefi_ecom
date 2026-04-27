const asyncHandler = require('express-async-handler');
const adminModel = require('../../model/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRETKEY = process.env.ADMINPRIVATEKEY;

// Generate token
const generateToken = (admin) => jwt.sign({ _id: admin._id }, SECRETKEY, { expiresIn: "1h" });

// Admin SignIn
const adminSignIn = asyncHandler(async (req, res) => {
    try {
        const { admin_email, admin_password } = req.body;
        if (!admin_email || !admin_password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await adminModel.findOne({ admin_email }).exec();
        if (!admin || !bcrypt.compareSync(admin_password, admin.admin_password)) {
            return res.status(403).json({ message: "Invalid email or password" });
        }

        const token = generateToken(admin);
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Admin SignIn Error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

module.exports=adminSignIn;