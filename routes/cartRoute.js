const express = require("express");
const cart_route = express();
const bodyParser = require("body-parser");
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({extended:true}));

