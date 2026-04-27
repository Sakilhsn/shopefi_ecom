const productModel = require('../../model/product.model');

const getAllProduct = async(req,res)=>{
    try{
        const productData = await productModel.find().exec();
        if(productData.length>0){
            res.json(productData)
        }else{
            res.json({"message":"No data found"})
        }
    }
    catch(err){
        res.json({"error_message":err});
    }
}

const getById = async(req,res)=>{
    try{
        const productData = await productModel.findOne({"product_id":req.params.pid}).exec();
        if(productData){
            res.json(productData)
        }else{
            res.json({"message":"Invalid Id"})
        }
    }
    catch(err){
        res.json({"error_message":err});
    }
}

module.exports={
    getAllProduct,
    getById
}