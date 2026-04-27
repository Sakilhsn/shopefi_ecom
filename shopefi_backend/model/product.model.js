const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    "product_id":{
        type: String,
        required:[true,"product_id required"],
        unique: true
    },
    "product_name":{
        type: String,
        required:[true,"product_name required"],
    },
    "product_price":{
        type:Number,
        required:[true,"product_price required"]
    },
    "product_discount":{
        type:Number,
        required:[true,"product_discount required"],
        min: 0,
        max: 99
    },
    "product_category":{
        type: String,
        required:[true,"product_category required"],
    },
    "product_description":{
        type: String,
        required:[true,"product_description required"],
    },
    "product_image":{
        type: String,
        required:[true,"product_image required"],
    }
},{versionKey:false})
                              //NameOfModel   //SchemaObj     //Collections
module.exports= mongoose.model("productModel",productSchema,"products");
console.log("Products Model is ready to use");