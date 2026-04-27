const express = require('express');
const productRouter = express.Router();

const adminAuth = require('../middleware/adminAuth');

// Get Data
const {getAllProduct,getById}=require('../controller/products/getProduct.controller');
productRouter.get('/show',getAllProduct);
productRouter.get('/show/:pid',getById);

// Insert Product Data (Admin Protected)
const addProduct=require('../controller/products/addProduct.controller');
productRouter.post('/add',adminAuth,addProduct);

// Update Product Data (Admin Protected)
const updateProduct = require('../controller/products/updateProduct.controller');
productRouter.all('/update/:pid',adminAuth,updateProduct);

// Delete Products (Admin Protected)
const deleteProduct= require('../controller/products/deleteProduct.controller')
productRouter.delete('/delete/:pid',adminAuth,deleteProduct)

module.exports=productRouter;
console.log("Products Router is working....");