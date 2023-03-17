const express = require("express");
const path = require("path");
const app = express();
const route = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
// const fileUpload = require('express-fileupload');
// const path = require('path');
const bodyParser = require("body-parser")
const multer = require('multer');
// const fs = require('fs');
require("dotenv").config();

// Importing modles
const Contact = require("../models/contact.js");
const User = require("../models/signup.js");
const Product = require("../models/product");
// const check = require('../middleware/auth.js');


const uploads = path.join(__dirname,"../public/uploads/");
var upload = multer({
      storage:multer.diskStorage({
        destination:function(req,file,cb){
          cb(null,uploads)
        },
        filename:function(req,file,cb){
          cb(null,file.originalname)
        }
      })
}).single("image")

route.get("/",check, async(req, res)=>{
try{
  const products = await Product.find({}).limit(100)
    return  res.render("index" , {message:'',name:req.data.namee, products:products});
}catch(err){
   console.log(err);
}
});

route.get("/admin",function (req, res) {
  const admin = "admin@gmail.com";
  const email = "admin@gmail.com";
  // const email = req.body.email;
  if(email === admin){
  res.render('starter',{message:''});
  }else{
    res.render('about');
  }
});

// get request for signup page
route.get("/signin", function (req, res) {
  res.render("signin", { message: "" ,name:''});
});

route.get("/login", function (req, res) {
  res.render("signin", { message: ""});
});

// post request and logic for signup page
route.post("/signup", async (req, res) => {
  JWT_SECRET = 'goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu'
  // Checking that user filled in all fields
  const { namee, email, phone, password, cpassword } = req.body;
  const symbol = "@+-/*#$%^&*()_";
  const num = "0123456789";

  if (!namee || !email || !phone || !password || !cpassword) {
    return res.render("signin", { message: "Please fill in all fields" });
  } else if (phone.length !== 10) {
    return res.render("signin", {
      message: "Please enter a valid phone number",
    });
  } else if (
    !password.length >= 8 &&
    !password.includes(symbol) &&
    !password.includes(num)
  ) {
    return res.render("signin", {
      message:
        "Please enter a valid password with numeric characters and special characters",
    });
  } else if (password !== cpassword) {
    return res.render("signin", { message: "Passwords do not match"});
  } else if (!validator.validate(email)) {
    return res.render("signin", { message: "Please enter a valid email" });
  } else {
    try {
      // Checking user exists or not
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.render("signin", { message: "Mail already registred" });
      }
      // At the end creating a new user
      const token = jwt.sign({ email },JWT_SECRET,{expiresIn : "2h"});
      const newUser = new User({ namee, email, phone, password, cpassword,token});
      const createUser = await newUser.save();
      if (createUser) {
          return res.render("signin", { message: "Registred Sucessfully!!!" });
     
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// Middleware function for checking the user is legit or not
async function check (req,res,next){
  const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
    const token = req.cookies.jwtToken;
    if (!token) {
     return res.render('signin',{message:''});
    }

    try{
      const data = jwt.verify(token,JWT_SECRET);
      const user = await User.findOne({email:data.email});
      req.data = user;

      next();
  
    }catch(err){
      res.clearCookie('jwtToken');
      return res.render('signin',{message:''});
    }
}

// Login Page
route.post("/login", async (req, res) => {
  JWT_SECRET = 'goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu'
  const { email, password,namee} = req.body;
  try {
    const Username = await User.findOne({ email: email });
    // console.log(Username);
    if (!Username) {
      return res.render("signin", { message: "User not found" });
    } else if(email=="admin@gmail.com"){
      res.render('starter',message='');
    } else {
      if (Username) {
        bcrypt.compare(password, Username.password, function (err, result) {
          if (result == true) {
            const token = jwt.sign({ email },JWT_SECRET,{expiresIn:"2h"});
            
            return res.cookie('jwtToken',token,{expires:new Date(Date.now() + 25892000000),httpOnly:true}).render("index",{ message: "Logged in Successfully",name:'',products:'' });
  
          }
       
        });
      } else {
        return res.render("signin", { message: "Something went Wrong" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});


// get request for shop page
route.get("/shop", function (req, res) {
  res.render("shop",{message:''});
});

// get request for about page
route.get("/about", function (req, res) {
  res.render("about");
});

// get request for shop-details page
route.get("/shop-details", function (req, res) {
  res.render("shop-details");
});

// get request for shopping-cart page
route.get("/shopping-carts", function (req, res) {
  res.render("shopping-cart");
});
route.get("/cart", function (req, res) {
  res.render("cart");
});

// get request for checkout page
route.get("/checkout", function (req, res) {
  res.render("checkout");
});

// get request for contact page
route.get("/contact",check, function (req, res) {
  res.render("contact", { message: "", name : req.data.email });
});

// post request for contact page
route.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.render("contact", {message: "Please fill in all fields",name: name, });
  }

  try {
    const newContact = new Contact({ name, email, message });
    const createMessage = await newContact.save();
    if (createMessage) {
      return res.render("contact", {
        message: "Message sent sucessfully!!! ",
        name: name,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Adminn Get Routes

route.get('/form', function(req, res){
  res.render("pages/form",{message:''});
});

route.get('/userdata', async (req,res)=>{
  const users = await User.find({}).limit(200);
  res.render("pages/data",{users:users});
});

route.get('/showproducts', async (req, res) => {
  const products = await Product.find({}).limit(100);
  res.render("pages/showproducts",{message:'', products:products});
});

route.get('/edit/:id',async(req, res,next) => {
   const id = req.params.id;
 try{
  const products = await Product.findOneAndUpdate({_id:id},req.body,{new:true});
       if(products){
          return res.render('pages/edit',{message:'',Product:products});
       }else{
        return console.log('No products found');
       }
 }catch(err){
  console.log(err);
 }
  });

route.post('/edit/:id',upload,async(req,res,next)=>{
    const id = req.params.id;
 try {
  const p = await Product.findByIdAndUpdate({_id:id},req.body);
  console.log(p.prices);
  if(!p){
    return res.render('pages/edit',{message:'Not Found',Product:''});
  }else{
    const products = await Product.find({}).limit(100);
    return res.render('pages/edit',{message:'Updated',Product:''});
  }
 } catch (error) {
  console.log(error);
 }
  });
  
// Delete particluar student
route.get('/delete/:id',async (req,res)=>{
  try {
     const _id = req.params.id;
     const product= await Product.findByIdAndDelete(_id)
     if(!_id){
        return res.status(400).send('not found');
     }else{
    return  res.render('pages/form',{message:'Deleted Successfully'});
     }
  } catch (error) {
     res.send(error)
  }
})
 


// Admin Post Routes

route.post('/addproduct',upload,async(req,res)=>{
try{
  const productname =req.body.productname;
  const productdescription =req.body.productdescription;
  const prices =req.body.prices;
  const image = req.file.filename;

const newProduct =await Product({productname, productdescription, prices, image});
newProduct.save();
const products = await Product.find({}).limit(100);
res.render("pages/showproducts",{message:'Product Added Successfully',products:products});
   
}catch(err){
  console.log(err);
}
});
//   const { productname , productdescription ,prices } = req.body;
 
//   image = req.body.files;
// if(!productname || !productdescription || !prices){
//   console.log("Please Fill All the Details");
// }
// try {
//   const product = new Product({ productname, productdescription, prices });
//   const added = await product.save();
//   if(added){
//     console.log(image);
//   return res.render('starter',{message:"Product Added Successfully"});
//   }
// } catch (error) {
//   console.log(error)
// }



// get request and logic for 404 page
route.get("*", (req, res) => {
  res.render("404");
});


// -------------------------ADmin Pages-------------------------------------------------------

// -------------------------ADmin Pages-------------------------------------------------------


module.exports = route;
