const express = require("express");
const userRouter = express.Router();
require('dotenv').config();

const adminAuth = require('../middleware/adminAuth');

const userAuth = require('../middleware/userAuth');


const getUserController=require('../controller/users/getUsers.Controller')
//getAllTheUsers (Admin Protected)
userRouter.get("/show/all",adminAuth, getUserController.getUser);
//getuserById   (User Protected)
userRouter.get("/show/:uid",userAuth, getUserController.getUserById);

const userSignController=require('../controller/users/userSignUp.Controller')
// signUp route
userRouter.post("/signup",userSignController.userSignUp)

// Signin Route
userRouter.post("/signin", userSignController.userSignIn);

// Update User
const updateUserById=require("../controller/users/updateUser.controller")
userRouter.all("/update/:uid",userAuth,updateUserById);

// Delete User
const deleteUserByUserId=require("../controller/users/deleteUser.Controller")
userRouter.delete("/delete/:uid",userAuth,deleteUserByUserId);

module.exports = userRouter;
console.log("userRouter is working ");
