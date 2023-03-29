const mongoose = require('mongoose')
const C = mongoose.Schema({
   product : {
    type : Array,
    value:[],
   }
});

module.exports = mongoose.model('C',C)