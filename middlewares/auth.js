const jwt = require('jsonwebtoken');


// Middleware function for checking the user is legit or not
const check = async (req,res,next) => {
    const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
      const token = req.cookies.jwtToken;
      if (!token) {
       return res.render('signin',{message:''});
      }
  
      try{
        const data = jwt.verify(token, JWT_SECRET);
        req.data = data;
        next();
    
      }catch(err){
        res.clearCookie('jwtToken');
        return res.render('signin',{message:''});
      }
  
  }

  module.exports = check;