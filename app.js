
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const User = require("./models/signup");
const expressValidator = require("express-validator");
const routes = require("./routes/routes.js");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors());
//app.use(adminRouter);
// app.use('/uploads', express.static(path.join(__dirname,'uploads')));
// app.use('/api',fileRoutes.routes);
// app.use(fileUpload);
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
    cookie: { maxAge: 1000 * 60 * 60 * 24,secure: true },
  })
);

app.use(flash())
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(User.createStrategy());
// Express validator middleware
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(expressValidator({
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
// app.use(admin_router);

const run = async () => {
  app.listen(port, (req, res) => {
    console.log(`server is running on port ${port}`);
  });
};
run();
