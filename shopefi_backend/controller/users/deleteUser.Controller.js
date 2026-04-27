const asyncHandler = require('express-async-handler');
const userModel = require('../../model/users.model');
const orderModel = require('../../model/orders.model');

const deleteUserByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.uid;

    if (!userId) {
        return res.status(400).json({ message: "User ID must be provided" });
    }

    try {
        const userInfo = await userModel.findOne({user_id:userId}).exec();
        if(userInfo){

        const deleteUser = await userModel.deleteOne({ user_id: userId }).exec();
        
        await orderModel.deleteMany({user_id : userInfo._id})

        if (deleteUser.deletedCount === 1) {
            return res.status(200).json({ message: "User data successfully deleted" });
        } else {
            return res.status(404).json({ message: "User not found or already deleted" });
        }
    }else{
        res.json({message:"User not found"})
    }
    } catch (err) {
        return res.status(500).json({ error_msg: err.message });
    }
});

module.exports = deleteUserByUserId;
console.log("deleteUserByUserIdController is working");
