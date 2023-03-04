// Requiring dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const flash = require('connect-flash');
const session = require('express-session');
app.use(bodyParser.urlencoded({
    extended: true
  }));

// Port number
const port = 8080 || process.env.PORT;

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Razzaq:Razzaq%402003@cluster0.pysaqrm.mongodb.net/jersey",{useNewUrlParser:true})
.then(()=>{
    console.log(`Database connected successfully`);
})
.catch((err)=>{
    console.log(err);
})

// Setting view engine to ejs
app.use(express.static("public"));
app.use(session({
   secret: 'keyboard cat',
   cookie:{maxAge: 60000},
   resave:false,
   saveUninitialized:false

}));
app.use(flash());

app.set('view engine', 'ejs');

// Routes
app.use(routes);

// Listning Port
app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`);
})