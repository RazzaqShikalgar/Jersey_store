const mongoose = require('mongoose');  

//   Mongoose connection
mongoose.set('strictQuery', false);
const conn = mongoose.connect('mongodb+srv://Razzaq:Razzaq%402003@cluster0.pysaqrm.mongodb.net/jersey')
.then(()=>{
    console.log(`Database connected successfully`);
})
.catch((err)=>{
    console.log(err);
})

module.exports = conn;
