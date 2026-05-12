const asyncHandler = require("express-async-handler");
const adminModel = require("../../model/admin.model");
const mongoose = require("mongoose");

const deleteAdmin = asyncHandler(async (req, res) => {
  try {
    const { admin_id } = req.params;

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

    // Delete admin
    await adminModel.findByIdAndDelete(admin_id);

    return res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete Admin Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

module.exports = deleteAdmin;