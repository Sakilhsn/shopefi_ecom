const multer = require('multer');

const myStorage = multer.diskStorage({
    filename:(req,file,cb)=>{
        cb(null,"shopefi-"+Math.random()*9999+"-"+Date.now()+file.originalname);
      },
      destination:"./public/uploads/"
})

const singleUpload = multer({
    storage:myStorage
});
module.exports=singleUpload;
console.log("multer is working");