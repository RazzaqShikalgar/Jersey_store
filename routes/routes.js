const express = require("express");
const path = require("path");
const app = express();
const route = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const multer = require('multer');
const nodemailer = require('nodemailer');


require("dotenv").config();

// Importing modles
const Contact = require("../models/contact.js");
const User = require("../models/signup.js");
const Product = require("../models/product");
const Cart = require("../models/cart.js");
const addProducts = require('../controllers/productController');
const C = require('../models/c.js')
const { Router } = require("express");
const { Console } = require("console");




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

route.get('/otp',(req,res)=>{
res.render('otp')
})

// Middleware function for checking the user is legit or not 

//Multer Upload Route
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

// Search Router
route.post('/',async(req,res)=>{
  try{
    const search = req.body.search;
    console.log(search);
  const a = await Product.find({$text:{$search: search, $diacriticSensitive:true}});
  console.log(a);
  res.redirect('/');
 }catch(err) {
  console.log(err);
 }
});

//Main page route 
route.get("/",check, async(req, res)=>{
try{
  const products = await Product.find({}).limit(100)
    return  res.render("index" , {message:'',name:req.data.namee, products:products,});
}catch(err){
   console.log(err);
}
});
//main page route ends

//Admin Page Route Start
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

// Signup Post Route

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
    return res.render("signin", {message:"Please enter a valid password with numeric characters and special characters",
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



//login Get Route
route.get("/login", function (req, res) {
  res.render("signin", { message: ""});
});

// OTP

route.get("/otp", (req, res) => {
  res
render("otp");})

route.post('/generate-otp', async (req,res) => {
  try {

    console.log("huii")
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);

    console.log(otp)
    // req.session.otp = otp;
    // Send OTP via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: '21104023bharatsharma@gmail.com',
        pass: 'ecmdqcyhhsbwgolq'
      }
    });
    const mailOptions = {
      from: '21104023bharatsharma@gmail.com',
      to: email,
      subject: 'OTP for password reset',
      text: `Your OTP is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({otp, message: 'OTP sent successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).send({error});
  }
});

route.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp || otp !== req.body.trueOtp) {
      return res.status(401).send('Invalid OTP');
    }
    res.status(200).send('OTP verified');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying OTP');
  }
});


// Login post route
route.post("/login", async (req, res) => {
  JWT_SECRET = 'goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu'
  const { email, password, namee} = req.body;
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
            
            return res.cookie('jwtToken',token,{expires:new Date(Date.now() + 25892000000),httpOnly:true}).redirect("/");
  
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

//Logout route
route.get('/logout',check,(req,res)=>{
  return res
  .cookie.remove("jwtToken")
  .redirect('/login')
  .json({ message: "Successfully logged out 😏 🍀" });
});

 // ---------------------------------------Get  Request for pages Start //----------------------------

 // get request for shop page
route.get("/shop",check,async(req, res)=>{
  const products = await Product.find({}).limit(100)
  res.render("shop",{name:req.data.namee,sage:'',products:products});
});

// get request for about page
route.get("/about",check, function (req, res) {
  res.render("about",{name:req.data.namee});
});

// get request for shopping-cart page
route.get("/shopping-carts",check, function (req, res) {
  res.render("shopping-cart",{name:req.data.namee});
});

//get request for cart page
route.get("/cart",check, function (req, res) {
  res.render("cart",{name:req.data.namee});
});

// get request for checkout page
route.get("/checkout",check, function (req, res) {
  res.render("checkout",{name:req.data.namee});
});

// get request for contact page
route.get("/contact",check, function (req, res) {
  res.render("contact", {name:req.data.namee,message: "", name : req.data.email });
});

//shop route
route.get('/shop-details',check,async(req,res)=>{
  const products = await Product.find({}).limit(100);
  return res.render('shop-details',{Product:'',name:req.data.namee,message:'',products:products})
});

//---------------------Adminn Get Route---------------------------

route.get('/form', function(req, res){
  res.render("pages/form",{message:''});
});

route.get('/userdata', async (req,res)=>{
  const users = await User.find({}).limit(200);
  res.render("pages/data",{users:users});
});

route.post('/addproduct',upload,async(req,res)=>{
  try{
    const productname =req.body.productname;
    const productdescription =req.body.productdescription;
    const prices =req.body.prices;
    const category =req.body.category;
    const selling_strategy = req.body.selling_strategy;
    const image = req.file.filename;
  
  const newProduct =await Product({productname, productdescription, prices, image,category,selling_strategy});
  newProduct.save();
  const products = await Product.find({}).limit(100);
  res.render("pages/showproducts",{message:'Product Added Successfully',products:products});
     
  }catch(err){
    console.log(err);
  }
  });
  
route.get('/showproducts', async (req, res) => {
  const products = await Product.find({}).limit(100);
  res.render("pages/showproducts",{message:'', products:products});
});

// ---------------------------------------Get  Request for pages End //----------------------------
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

// Edit Product Router
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
    return  res.redirect('/showproducts');
     }
  } catch (error) {
     res.send(error)
  }
});
 


// Admin Post Routes
//Add Product Route 



route.get('/shop-details/:id',check,async(req,res)=>{
  try{
    const id = req.params.id;
    const product = await Product.findById(id);
    const products = await Product.find({}).limit(100);
    // res.json(Product);
  if(!product){
    console.log('No products found');
 }else{
  return res.render('shopping',{Product:product,name:req.data.namee,message:'',products:products})
 }
}catch(err){
  console.log(err);
}
  });



 route.post('/addtocart',check,async(req,res,next)=>{
  
    const cart = req.body;
    console.log(cart);
    const { _id } = req.data._id;
    // validateMongoDbId(_id);
    try {
      let products = [];
      const user = await User.findById(_id);
      // check if user already have product in cart
      const alreadyExistCart = await Cart.findOne({ orderby: user._id });
      if (alreadyExistCart) {
        alreadyExistCart.deleteOne();
      }
      for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i]._id).select("prices").exec();
        object.price = getPrice.prices;
        products.push(object);
      }
     let cartTotal=0;
     for(let i=0; i<products.length; i++){
      cartTotal=cartTotal+products[i].price * products[i].count;

     }
     console.log(products,cartTotal);
     let newCart=await new Cart({
      products,
      cartTotal,
      orderby:user?._id,

     }).save()
     res.json(newCart)
    }catch(error){
      throw new Error(error)
    }
  });

    // const {orderby,_id} = req.data._id;
    // // let n = 1;
    // const product = await Cart.findById(id);
    // // const productss = await Cart.findOne({orderby:_id});
    // // console.log(productss);
    // // console.log(product);
    // // const { _id } = req.data._id;
    // try {
    //   let products = [];
    //   const user = await User.findById(_id);
    //   // check if user already have product in cart
    //   const alreadyExistCart = await Cart.findOne({ orderby:_id });
    //   if (!alreadyExistCart){
    //     // alreadyExistCart.remove();
    //     // console.log("Already added in cart");
    //   }
    //   for (let i = 0; i < cart.length; i++) {
    //     let object = {};
    //     object.product = cart[i].id;
    //     object.count = cart[i].count;
    //     object.color = "Green";
    //     const product = await Product.findById(id);
    //     object.price =product.prices;
    //     // object.Product = product._id;
    //     products.push(object);
    //   }
    //   // const alreadyExistCart = await cart.findOne({ orderby: user._id });
    //   //   if (alreadyExistCart) {
    //   //     alreadyExistCart.remove();
    //   //   }
    //   //   for (let i = 0; i < cart.length; i++) {
    //   //     let object = {};
    //   //     object.product = cart[i]._id;
    //   //     object.count = cart[i].count;
    //   //     object.color = cart[i].color;
    //   //     let getPrice = await cart.findById(Cart[i]._id).select("price").exec();
    //   //     object.price = getPrice.prices;
    //   //     products.push(object);
    //   //   }
    //  let cartTotal=0;
    //  for(let i=0; i<product.length; i++){
    //   cartTotal=cartTotal+cart[i].price * cart[i].count;
    //  }
    //  console.log(products,cartTotal);
    //  let newCart=await new Cart({
    //   products,
    //   cartTotal,
    //   orderby:user?._id,

    //  }).save()
    //  console.log(newCart);
    // //  const counts = await Cart.count(id);
    // //  console.log(counts);
    //  res.json(newCart)
    // //  n++;
      
    // }catch(error){
    //   throw new Error(error)
    // }

  // });

  // route.put('/rating',check,async(req,res)=>{
  //   const userId = req.data;
  //   const {star,productId} = req.body; 
  //   try {
  //     const product  = await Product.findById(prodId);
  //   let alreadyRated = product.ratings.find(
  //     (userId)=> userId.postedby.toString() === id.toString());
  //     if(alreadyRated){
  //       const updateRating = await Product.updateOne(
  //         {
  //         ratings:{$elemMatch:alreadyRated},
  //         },
  //         {
  //         $set:{"ratings.$.star":star},
  //       } , 
  //       {
  //         new:true,
  //       }
  //       );
  //         res.json(updateRating);

  //     } else {
  //       const rateProduct = await Product.findByIdAndUpdate(productId,
  //         {
  //           $push:{
  //             ratings: {
  //               star:star,
  //               postedby: userId,
  //       },
  //       },
  //       },{
  //         new:true,
  //       }
  //       ); 
  //       res.json(rateProduct);
  //     }
  //   } catch (error) {
      
  //   }
  // });


  //get user cart
  route.get('/carts',check,async(req,res)=>{
    const {_id}=req.data;
    // validateMongoDbId(_id);
    try{
      const cart=await Cart.findOne({orderby:_id}).populate("products.product");
      res.json(cart)
    }catch(error){
      throw new Error
    }
  });

  route.put("/addtowishlist",check,async(req,res)=> {
const id = req.data._id;
const proId = req.body;
try {
  const user = await  User.findById({_id:id});
  const alreadyadded = User.wishlist.find((id)=>id.toString() === proId);
  if(alreadyadded){
const user = await User.findByIdAndUpdate(
  id,
  {
  $pull:{wishlist:proId},
},{
  new:true,
}
);
res.json(user);
  } else {
    let user = await User.findByIdAndUpdate(
      id,
      {
      $push:{wishlist:proId},
    },{
      new:true,
    }
    );
    res.json(user);
  }
} catch (error) {
  
}
  });

  // route.post('/get',check,async(req,res)=>{
  //   const {_id}=req.data;
  //   // validateMongoDbId(_id);
  //   try{
  //     const cart=await Cart.findOne({orderby:_id}).populate("products.product");
  //     res.json(cart)
  //   }catch(error){
  //     throw new Error
  //   }
  // })

// ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ get request and logic for 404 page ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ 

route.get("*", (req, res) => {    //-   ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠  ⚠ ⚠ ⚠ ⚠ ⚠ //⚠
  res.render("404");                                                       //⚠
});                                                                        //⚠
// ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ get request and logic for 404 page ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ 
module.exports = route;



