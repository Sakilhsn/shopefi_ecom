const env=require('dotenv').config();
const mongoose = require('mongoose');

//var DB_URL =`${process.env.MONGO_URL}://${process.env.HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
// var DB_URL = `mongodb+srv://sakilhossaincom:6emisOKSrGh00sPa@shopefy-api-cluster.1oaer.moengodb.nt/shopefiDB  `
var DB_URL =`${process.env.MONGO_URL}://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;

//var DB_URL=`mongodb+srv://sakilhossaincom:6emisOKSrGh00sPa@shopefy-api-cluster.1oaer.mongodb.net/?retryWrites=true&w=majority&appName=shopefy-api-cluster`

module.exports= 
mongoose.connect(DB_URL)
        .then(()=>{
            console.log("MongoDB connected to Remote Server successfully");
        })
        .catch((error)=>{
             console.log("Error :"+error);
        });
console.log("mongodb global connection is working");