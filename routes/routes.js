const express = require("express");
const app = express();
const route = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");

// Importing modles
const Contact = require("../models/contact.js");
const User = require("../models/signup.js");

// Routes
// get request for landing page
route.get("/", function (req, res) {
  res.render("index");
});

// get request for signup page
route.get("/signin", function (req, res) {
  res.render("signin", { message: "" });
});

route.get("/login", function (req, res) {
  res.render("signin", { message: "" });
});

// post request and logic for signup page
route.post("/signup", async (req, res) => {
  // Checking that user filled in all fields
  const { name, email, phone, password, cpassword } = req.body;
  const symbol = "@+-/*#$%^&*()_";
  const num = "0123456789";

  if (!name || !email || !phone || !password || !cpassword) {
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
    return res.render("signin", { message: "Passwords do not match" });
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
      const newUser = new User({ name, email, phone, password, cpassword });
      const createUser = await newUser.save();
      if (createUser) {
        return res.render("signin", { message: "Registred Sucessfully!!!" });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// Login Page
route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const Username = await User.findOne({ email: email });
    if (!Username) {
      return res.render("signin", { message: "User not found" });
    } else {
      if (Username) {
        bcrypt.compare(password, Username.password, function (err, result) {
          if (result == true) {
            return res.render("signin", { message: "Login Successfully!!!" });
          } else {
            return res.render("signin", { message: "Password is incorrect" });
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

//   {
//     if(err){
//       console.log(err);
//     } else{
//       if(foundUser){
//        bcrypt.compare(password,foundUser.password,function(err,result){
//         if(result==true) {
//           return  res.render("register",{message:'Logged in successfully'});
//         }
//         else{
//           return res.render("register",{message:'Something went wrong'});
//         }
//        });

//       }
//       else {
//         return res.render("register",{message:'Something went wrong'});
//       }
//     }
//   });
// });

// Post request and logic for login page
// route.post('/login',async()=>{
// try {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.render('signin',{
//       message: "Please fill in all fields",
//     });
//   }else{
//     return res.render('signin',{
//       message: "Login Sucessfully!!!",
//     })
//   }

//   const userLogin = await User.findOne({ email });
//   console.log(userLogin);
// }catch (err) {
//   console.log(err);
// }
//   //   if (userLogin) {
//   //     const isMatch = await bcrypt.compare(password,userLogin.password);

//   //     if (!isMatch) {
//   //       return res.json({
//   //         success: false,
//   //         msg: "wrong",
//   //       });
//   //     } else {
//   //       return res.json({
//   //         success: true,
//   //         msg: "login",
//   //       });
//   //     }
//   //   } else {
//   //     return res.json({
//   //       success: false,
//   //       msg: "wrong",
//   //     });
//   //   }
//   // } catch (err) {
//   //   console.log(err);
//   // }
// })

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
route.get("/shopping-cart", function (req, res) {
  res.render("shopping-cart");
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

module.exports = route;
