const asyncHandler = require('express-async-handler');
const userModel = require('../../model/users.model');

// Get all users
const getUser = asyncHandler(async (req, res) => {
    try {
        const users = await userModel.find().exec();
        if (!users.length) {
            return res.status(404).json({ message: "No data found" });
        }
        return res.status(200).json({ "user_info": users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await userModel.findOne({ user_id: req.params.uid }).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ "user_info": user });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

module.exports = { getUser, getUserById };

console.log("User Controller is working");
