const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  "user_id": {
    type: String,
    required: [true, "user_id has to be provided"],
  },
  "user_name": {
    type: String,
    required: [true, "user name has to be provided"],
    minLength: 3,
  },
  "user_age": {
    type: Number,
    required: [true, "age has to be provided"],
  },
  "user_gender": {
    type: String,
    enum: ["Male", "Female", "Others"], 
    required: [true, "Gender is required"],
  },
  "user_email":{
    type:String,
    unique:true,
    validate:{
        validator:(elementValue)=>{
            return /^[a-zA-Z0-9._%+]+@[A-Za-z0-9._]+\.[a-zA-Z0-9]{2,}$/.test(elementValue)
        },
        message:props=>`${props.value} is not valid`
    }

  },
  "user_phone":{
    type:Number,
    unique:true,
    validate:{
        validator:(elementValue)=>{
            return /^(?:\+?\d{1,3})?[ -]?\d{10}$/.test(elementValue)
        },
        message:props=>`${props.value} is invalid`
    }

  },
  "user_password": {
    type: String,
    required: [true, "password has to be provided"],
    validate: {
      validator: (elementValue) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*?]).{8,}$/.test(elementValue);
      },
      message: (props) => 
        `${props.value} is invalid`
    },
  },
  

},{versionKey:false});
module.exports=mongoose.model('userModel',userSchema,"users")
console.log("users model is working")
