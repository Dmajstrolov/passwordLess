module.exports = function(code,email){

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hinhale123@gmail.com',
      pass: 'hejabc123'
    }
  });

  var mailOptions = {
    from: 'hinhale123@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    text: code
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
}