const productModel = require('../../model/product.model');

const deleteProduct = async(req,res)=>{
    try{
        const deleteInfo = await productModel.deleteOne({"product_id":req.params.pid}).exec();
        if(deleteInfo.deletedCount==1){
            res.json({"message":`Product deleted successful with id:${req.params.pid}`})
        }else{
            res.json({"message":"Invalid Id"})
        }
    }
    catch(err){
        res.json({"error_message":err});
    }
}

module.exports=deleteProduct;