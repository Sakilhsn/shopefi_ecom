const multerModel = require('../../model/multer.config');
const productModel = require('../../model/product.model');

let ImagePath = '';
const updateProduct = async (req, res) => {
    if (req.method == 'PUT' || req.method == 'PATCH') {
        if (req.file) {
            ImagePath = "uploads/" + req.file.filename;
        } else {
            try {
                const productInfo = await productModel.findOne({ "product_id": req.params.pid }).exec();
                if (productInfo) {
                    ImagePath = productInfo.product_image;
                } else {
                    res.json({ "message": "Invalid Product Id" })
                }
            }
            catch (err) {
                res.json({ "Error message": err });
            }
        }
        try {
            const updateInfo = await productModel.updateOne({ "product_id": req.params.pid },
                {
                    $set: {
                        "product_name": req.body.pname,
                        "product_price": req.body.price,
                        "product_discount": req.body.discount,
                        "product_category": req.body.category,
                        "product_description": req.body.description,
                        "product_image": ImagePath
                    }
                }).exec();

            if (updateInfo.modifiedCount == 1) {
                res.json({ "message": "Data Updated Successful" })
            } else {
                res.json({ "message": "Data update error" });
            }
        }
        catch (err) {
            res.json({ "error_message": err });
        }
    } else {
        res.status(404).json({ "message": "Invalid Methods" });
    }
}

module.exports = [multerModel.single('pImage'), updateProduct];