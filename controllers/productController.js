const cloudinary = require('cloudinary');
const getDataUri = require("../utils/dataUri.js");
const catchAsyncError = require("../middlewares/catchAsyncError.js");

 const addProducts = catchAsyncError(async (req,res,next) => {

        const { productname, productdescription, prices, category, selling_strategy } = req.body;
        const image = req.file.filename;
       // const file = req.file;
       if (!productname || !productdescription || !prices || !category || !selling_strategy || !file)
        return next(new ErrorHandler("Please enter all fields", 400));

        const products = await Product.find({});

        const fileUri = getDataUri(file);
        const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
      
        products = await User.create({
            productname,
            productdescription,
            prices,
            category,
            selling_strategy,
            image: {
                public_id: mycloud.public_id,
                url: mycloud.secure_url,
            }
        })
    
        sendToken(res, products, "Product Added Successfully", 201)
         
      
});
module.exports= addProducts;

