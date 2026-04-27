const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    "admin_email": {
        type: String,
        unique: true,
        validate: {
            validator: (elementValue) => {
                return /^[a-zA-Z0-9._%+]+@[A-Za-z0-9._]+\.[a-zA-Z0-9]{2,}$/.test(elementValue)
            },
            message: props => `${props.value} is not valid`
        }
    },
    "admin_password": {
        type: String,
        required: [true, "password has to be provided"],
        validate: {
            validator: (elementValue) => {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*?]).{8,}$/.test(elementValue);
            },
            message: (props) =>
                `${props.value} is invalid`
        },
    }
},{versionKey : false});

module.exports=mongoose.model('adminModel',adminSchema,"admin");
console.log("Admin model is working");
