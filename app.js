// Requiring dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
// Port number
const port = 8080 || process.env.PORT;

// Configuring dotenv
require("dotenv").config();

// Connecting to MongoDB
require("./config/database.js");

// Configuring body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Setting view engine to ejs
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use(routes);

// Listning Port
app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
