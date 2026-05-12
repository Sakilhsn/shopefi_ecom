const asyncHandler = require("express-async-handler");
const adminModel = require("../../model/admin.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const updateAdmin = asyncHandler(async (req, res) => {
  try {
    const { admin_id } = req.params;
    const { admin_email, admin_password } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(admin_id)) {
      return res.status(400).json({
        message: "Invalid admin ID",
      });
    }

    // Check admin exists
    const existingAdmin = await adminModel.findById(admin_id);

    if (!existingAdmin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Update object
    const updateData = {};

    if (admin_email) {
      updateData.admin_email = admin_email;
    }

    // Hash password if updating
    if (admin_password) {
      updateData.admin_password = bcrypt.hashSync(
        admin_password,
        bcrypt.genSaltSync(10)
      );
    }

    // Update admin
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      admin_id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Update Admin Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

module.exports = updateAdmin;