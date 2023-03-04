const express = require('express');
const app = express();
const route = express.Router();
const Contact = require('../models/contact.js');
const mongoose = require('mongoose');

route.get("/",function(req,res){
    res.render("index");
   });

route.get("/contact",function(req,res){
    res.render("contact",{message:''});
});

route.get("/signup",function(req,res){
    res.render("signup");
});



route.post("/contact",async (req,res)=>{

    const {name,email,message} = req.body;

try{
    const newContact = new Contact({name,email,message});
    const createMessage = await newContact.save();
    console.log(createMessage);
    if (createMessage) {
        const pops= "hello";
        res.render("contact",{message:'pops'});
      }
    } catch (err) {
      console.log(err);
    }


  });


module.exports = route;