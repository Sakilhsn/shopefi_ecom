const asyncHandler = require("express-async-handler");
const adminModel = require("../../model/admin.model");
const mongoose = require("mongoose");

// Get All Admins
const getAdmins = asyncHandler(async (req, res) => {
  try {
    const admins = await adminModel.find().select("-admin_password");

    if (!admins || admins.length === 0) {
      return res.status(404).json({
        message: "No admins found",
      });
    }

    return res.status(200).json({
      total_admins: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Get Admins Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

// Get Single Admin
const getSingleAdmin = asyncHandler(async (req, res) => {
  try {
    const { admin_id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(admin_id)) {
      return res.status(400).json({
        message: "Invalid admin ID",
      });
    }

    const admin = await adminModel
      .findById(admin_id)
      .select("-admin_password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      admin,
    });
  } catch (error) {
    console.error("Get Single Admin Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

module.exports = {
  getAdmins,
  getSingleAdmin,
};