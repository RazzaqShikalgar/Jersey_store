// Requiring dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/signup");
const session = require("express-session");
const passport = require("passport");
// const passportlocalmongoose = require("passport-local-mongoose");
const expressValidator = require("express-validator");
const routes = require("./routes/routes.js");
const cookieParser = require("cookie-parser");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(cookieParser());
//app.use(adminRouter);

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

// Express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Express validator middleware
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// Express messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Setting view engine to ejs
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use(routes);

const run = async () => {
  app.listen(port, (req, res) => {
    console.log(`server is running on port ${port}`);
  });
};
run();
