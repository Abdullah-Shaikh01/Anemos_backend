const nodemailer = require('nodemailer')



module.exports = async function sendOTP(email, otp) {
    //Uncomment this if authentication fails
    // let testAccount = await nodemailer.createTestAccount();
    // console.log(testAccount.user)
    // console.log (testAccount.pass)
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "nnvyaduyijuxbld5@ethereal.email", // generated ethereal user
        pass: "4W1fpGyr75W4vVvGxe", // generated ethereal password
        
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
