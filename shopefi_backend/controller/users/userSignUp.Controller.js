const asyncHandler = require("express-async-handler");
const userModel = require("../../model/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRETKEY = process.env.SECRETORPRIVATEKEY;

// Generate user ID
const generateUserId = () => `userId-${Math.floor(Math.random() * 9999)}-${Date.now()}`;

// Hash password
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Check password
const checkPassword = (inputPassword, storedPassword) => bcrypt.compareSync(inputPassword, storedPassword);

// Generate token
const generateToken = (userInfo) => jwt.sign({ _id: userInfo._id }, SECRETKEY, { expiresIn: "1h" });

// User Signup
const userSignUp = asyncHandler(async (req, res) => {
  try {
    const { uname, uage, ugender, uemail, uphone, upass } = req.body;
    if (!uname || !uage || !ugender || !uemail || !uphone || !upass) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const existingUser = await userModel.findOne({ $or: [{ user_email: uemail }, { user_phone: uphone }] });
    if (existingUser) {
      return res.status(403).json({ message: "Email or phone number already registered" });
    }
    
    const newUser = await userModel.create({
      user_id: generateUserId(),
      user_name: uname,
      user_age: uage,
      user_gender : ugender,
      user_email: uemail,
      user_phone: uphone,
      user_password: hashPassword(upass),
    });
    
    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// User Signin
const userSignIn = asyncHandler(async (req, res) => {
  try {
    const { uemail, upass } = req.body;
    if (!uemail || !upass) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const userInfo = await userModel.findOne({ user_email: uemail });
    if (!userInfo || !checkPassword(upass, userInfo.user_password)) {
      return res.status(403).json({ message: "Invalid email or password" });
    }
    
    const token = generateToken(userInfo);
    return res.status(200).json({ "message": "Login successful", "user_id": [userInfo.user_id,userInfo._id],"token": token });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = { userSignUp, userSignIn };

console.log("User Authentication Controller is working");
