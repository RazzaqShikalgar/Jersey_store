const mongoose = require('mongoose');
// const schema = require('schema');

const produSchema = new mongoose.Schema({
    productname:{ type:String},
        productdescription:{ type:String },
            prices:{ type:String},
                image:{type:String}
});
module.exports = mongoose.model('Product',produSchema);