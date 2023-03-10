const mongoose=require("mongoose")
const productSchema=new mongoose.Schema({
    name:{
        type:String
    },
    img:{
        type:String
    },
    image:{
        data :Buffer,
        contentType:String
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    desc:{
        type:String
    } 
    

})
const Product=new mongoose.model("products",productSchema)
module.exports=Product;