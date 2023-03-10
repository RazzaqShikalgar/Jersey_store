const express = require("express");
const app = express();
const route = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
// const run = require('../app.js');
// run();
// Importing modles
const Contact = require("../models/contact.js");
const User = require("../models/signup.js");

// Routes
// get request for landing page
route.get("/",check,function (req, res) {
    res.render("index" , {message:'',name:''});
});

// get request for signup page
route.get("/signin", function (req, res) {
  res.render("signin", { message: "" ,name:''});
});

route.get("/login", function (req, res) {
  res.render("signin", { message: "" });
});

route.get("/secrets", function (req, res) {
  if(req.isAuthenticated()) {
  res.render("secrets");
  } else {
    res.redirect('/about');
  }
});

// post request and logic for signup page
route.post("/signup", async (req, res) => {
  
  const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
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
      const token = await jwt.sign({ email }, JWT_SECRET,{expiresIn : "2h"});
      const newUser = new User({ namee, email, phone, password, cpassword,token});
      console.log(token);
      const createUser = await newUser.save();
      if (createUser) {
          return res.render("signin", { message: "Registred Sucessfully!!!" });
     
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// route.get('/api',check,(req,res)=>{
//   jwt.verify(req.token,'goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu',(err,data)=>{
//     if(err){
// res.json({err:err})
//     }else{

//       res.json({msg : 'protected',data : data})
//     }
//   })
// })

// Middleware function for checking the user is legit or not
async function check (req,res,next){
  const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
    const token = req.cookies.jwtToken;
    if (!token) {
     return res.render('signin',{message:''});
    }

    const data = jwt.verify(token, JWT_SECRET);
    email = data.email;
    const user = await User.findOne({email});
    // console.log(user);
    next();
}

// Login Page
route.post("/login", async (req, res) => {
 
  // The secret should be an unguessable long string (you can use a password generator for this!)
const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
  const { email, password,namee} = req.body;
  try {
    const Username = await User.findOne({ email: email });
    // console.log(Username);
    if (!Username) {
      return res.render("signin", { message: "User not found" });
    } else {
      if (Username) {
        bcrypt.compare(password, Username.password, function (err, result) {
          User.register({email: req.body.email, password: req.body.password});
          if (result == true) {
            // passport.authenticate("local")(req,res,function(){
                    // res.redirect("/secrets");
                    // return res.render("signin", { message: "Registred Sucessfully!!!" });
                  // });
            // return res.render("index",{ message: "Logged in Successfully" ,name:Username.namee});
            const token = jwt.sign({ email }, JWT_SECRET,{expiresIn:"2h"});
            return res.cookie('jwtToken',token,{expires:new Date(Date.now() + 25892000000),httpOnly:true}).render("index",{ message: "Logged in Successfully" });
  
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
  res.render("shop");
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
route.get("/contact", function (req, res) {
  res.render("contact", { message: "" });
});


// post request for contact page
route.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.render("contact", {
      message: "Please fill in all fields",
      name: name,
    });
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

// get request and logic for 404 page
route.get("*", (req, res) => {
  res.render("404");
});


// -------------------------Add-to-Cart-------------------------------------------------------


module.exports = route;
