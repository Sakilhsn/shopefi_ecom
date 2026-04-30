const express =require('express');
const app = express();
require('dotenv').config();

// Set Data Accessability
//loading cors lib.
const cors = require('cors');
app.use(cors()); //server cors free.
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Set EJS as the templating engine
app.set("view engine", "ejs");

//creating a server static resources.
app.use(express.static("public"));
app.use('/uploads', express.static('public/uploads'));
console.log("SSR is working on public folder");

// Home Page Route
app.get('/',(req,res)=>{
    res.render('home');
})

// Connect with MongoDB
require('./model/dbConnect.config');

// Product Routes
const productRouter=require('./routes/products.routes');
app.use('/shopefi/products/',productRouter);

//category routes
const categoryRouter=require('./routes/category.routes');
app.use('/shopefi/category/',categoryRouter);
// Admin Routes
const adminRouter=require('./routes/admin.routes');
app.use('/shopefi/super-admin/',adminRouter);

// User Routes
const userRouter = require('./routes/user.routes');
app.use('/shopefi/users/',userRouter);

// Order Routes
const orderRouter=require('./routes/orders.routes');
app.use('/shopefi/orders/',orderRouter);

app.listen(process.env.PORT,process.env.HOST,()=>{
    console.log(`Server Started at http://${process.env.HOST}:${process.env.PORT}`);
})