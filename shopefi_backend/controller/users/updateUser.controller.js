const usersModel = require("../../model/users.model");
const bcrypt= require("bcryptjs");
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const asyncHandler = require("express-async-handler");

const updateUserById = asyncHandler(async (req, res) => {
  if (req.method === "PUT" || req.method === "PATCH") {
    const { uname, uage, ugender, uemail, uphone, upass } = req.body;
    const user_id = req.params.uid;
    try {
      const userInfo = await usersModel.findOne({ user_id: user_id }).exec();
      if (userInfo) {
        try {
          const updatedUserInfo = await usersModel
            .updateOne(
              { user_id: user_id },
              {
                $set: {
                  user_name: uname,
                  user_age: uage,
                  user_gender: ugender,
                  user_email: uemail,
                  user_phone: uphone,
                  user_password: hashPassword(upass),
                },
              }
            )
            .exec();
            if(updatedUserInfo.modifiedCount===1){
              return res
              .status(200)
              .json({ "message": "user successfully updated" });
            }else{
              return res
              .status(401)
              .json({ message: "user doesn't exist"});
            }
        } catch (err) {
          return res.status(402).json({ message: err });
        }
      }
    } catch (err) {
      return res
        .status(401)
        .json({ message: "user doesn't exist", error_msg: err });
    }
  } else {
    return res
      .status(403)
      .json({ message: req.method + " method doesn't support on this " });
  }
});
module.exports=updateUserById;
console.log("updateUserController is working");
