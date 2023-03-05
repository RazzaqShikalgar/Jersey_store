const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema =  new mongoose.Schema({
    name      : { type:String , required:true },
    
    email     : { type:String , required:true },
    
    phone     : { type:Number , required:true },
 
    password  : { type:String , required:true },

    cpassword : { type:String , required:true },

    tokens    : [{token:{ type:String,required:true}}]
});

// Hashing the password before saving it to the database
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
      this.password = await  bcrypt.hash(this.password,10);
      this.cpassword = await bcrypt.hash(this.cpassword,10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);