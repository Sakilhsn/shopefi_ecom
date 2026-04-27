const express= require('express');
const adminRouter= express.Router();

// SignIN
const adminSignIn=require('../controller/admin/adminSignIn.controller');
adminRouter.post('/signin',adminSignIn);

// SignUP
const adminSignUp=require('../controller/admin/adminSignUp.controller');
adminRouter.post('/signup',adminSignUp);


module.exports=adminRouter;
console.log("Admin Router is working....");