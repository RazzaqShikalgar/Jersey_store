const mongoose = require('mongoose');
// const schema = require('schema');

const produSchema = new mongoose.Schema({
    productname:{ type:String},
    productNo:{type:String},
        productdescription:{ type:String },
            prices:{ type:String},
                category:{type:String},
                selling_strategy:{type:String},
                // ratings:[
                //     {
                //         star:Number,
                //         posted:{type: mongoose.Schema.Types.ObjectId,ref:"User"},
                //     },
                // ],
                // totalrating:{
                //     type:String,
                //     default:0,
                // }, 
                    image:{type:String}
});
produSchema.index({productname:'text', productdescription:'text'});
module.exports = mongoose.model('Product',produSchema);