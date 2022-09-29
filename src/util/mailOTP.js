const nodemailer = require('nodemailer')



module.exports = async function sendOTP(email, otp) {
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "mzhd6ujvmark344j@ethereal.email", // generated ethereal user
        pass: "56kdW5TVXKmAzDyFYs", // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "OTP to Reset Password", // Subject line
      text: "OTP: "+otp + " valid for 5 minutes", // plain text body
      html: `<p>You requested for reset password, kindly use this OTP: <b>${otp}</b> to verify</p> <p>OTP is valid for 5 minutes only</p>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    return "Success"
    
}
