
function Info_Email(P_Email) {

  this.Email = {

        Email_Name : P_Email,
        Email_Typeof: typeof P_Email,
        Email_Length: P_Email.length,
        Email_Standard_Gmail: `@gmail.com`,

  };

};

Info_Email.prototype.Email_Gmail = function() {
  var Write_Gmail = this.Email.Email_Name;
  var Write_Gmail_Slice = Write_Gmail.slice(this.Email.Email_Length - 10, this.Email.Email_Length);
      if(Write_Gmail_Slice === this.Email.Email_Standard_Gmail){
        return true;
      }else{
        return false;
      }

};



module.exports = Info_Email;
