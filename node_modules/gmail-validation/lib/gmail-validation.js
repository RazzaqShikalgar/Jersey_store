
var R_Email = require('./val/Email');


function Email(P_Email){

  Email = new R_Email(P_Email);
  return Email.Email_Gmail();

}

function GmailError(){
  return Email.Email_Gmail();
}


module.exports.Email = Email;
module.exports.GmailValidationError = GmailError;
