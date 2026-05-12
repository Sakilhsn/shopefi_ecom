const express= require('express');
const adminRouter= express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getAdmins,
  getSingleAdmin,
} = require("../controller/admin/getAdmin.controller");

// SignIN
const adminSignIn=require('../controller/admin/adminSignIn.controller');
adminRouter.post('/signin',adminSignIn);

// SignUP
const adminSignUp=require('../controller/admin/adminSignUp.controller');
adminRouter.post('/signup',adminSignUp);

// Admin Dashboard
const updateAdmin = require("../controller/admin/updateAdmin.controller");
adminRouter.put("/update/:admin_id", adminAuth, updateAdmin);

const deleteAdmin = require("../controller/admin/deleteAdmin.controller");
adminRouter.delete("/delete/:admin_id", adminAuth, deleteAdmin);

adminRouter.get("/all",adminAuth, getAdmins);

// Get single admin
adminRouter.get("/:admin_id", adminAuth, getSingleAdmin);

module.exports=adminRouter;
console.log("Admin Router is working....");