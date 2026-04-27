const express=require('express');
const orderRouter=express.Router();

const userAuth= require('../middleware/userAuth');

// Add Order (User Protected)
const addOrder=require('../controller/orders/addOrder.controller');
orderRouter.post('/add-order/:uid',userAuth,addOrder);

// Show Orders (User Protected)
const showOrders=require('../controller/orders/showOrder.controller');
orderRouter.get('/show/:user_id',userAuth,showOrders);

// delete Orders(User Protected)
const deleteOrder = require('../controller/orders/deleteOrder.controller')
orderRouter.delete('/delete/:oid',deleteOrder);

module.exports=orderRouter;