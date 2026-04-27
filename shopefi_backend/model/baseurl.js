require('dotenv').config();
const baseUrl=`http://${process.env.HOST}:${process.env.PORT}/`;
module.exports=baseUrl;