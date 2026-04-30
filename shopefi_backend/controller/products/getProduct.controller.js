const productModel = require('../../model/product.model');

const getAllProduct = async(req,res)=>{
    try{
        const productData = await productModel.find().exec();
        if(productData.length>0){
            res.json(productData)
            console.log(productData);
        }else{
            res.json({"message":"No data found"})
        }
    }
    catch(err){
        res.json({"error_message":err});
    }
}

const getById = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ product_id: req.params.pid })
      .populate("product_category", "category_name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching product",
      error: err.message,
    });
  }
};


module.exports = {
  getAllProduct,
  getById,
};
module.exports={
    getAllProduct,
    getById
}