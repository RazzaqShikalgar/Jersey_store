const mongoose = require('mongoose');

const ProductSchema =  new mongoose.Schema({

    productname   : { type:String , required:true },
    
    productdescription : { type:String , required:true },
    
      prices: { type:String , required:true }

    //   image : { data:buffer}

});

module.exports = mongoose.model("Products", ProductSchema);
