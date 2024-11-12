const nodemailer = require('nodemailer');

const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sarthapliyal13@gmail.com',  
      pass: 'ryfcqezudpzccwrr'    
    }
  });

  const mailOptions = {
    from: 'sarthapliyal13@gmail.com',
    to: email,
    subject: 'Account Verification',
    html: `Please click the link to set your password: 
         <a href="http://localhost:3000/api/set-password?token=${token}">Click Here</a>`

  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
