const nodemailer = require('nodemailer')



module.exports = async function sendOTP(email, otp) {
    //my try
    // const client = nodemailer.createTransport(
    // //     {
    // //     service: "Gmail",
    // //     auth: {
    // //         user: "firstlastcheck234@gmail.com",
    // //         pass: "firstlastCheck234"
    // //         // pass: "nnghizcgemptfltu"
    // //     }
    // // }
    // {
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: 'firstlastcheck234@gmail.com',
    //       pass: 'nnghizcgemptfltu',
    //     },
    //   }
    // );
    
    // const mailOptions = {
    //     from: 'firstlastcheck234@gmail.com',
    //     to: email,
    //     subject: 'OTP to Reset Password',
    //     html: `<p>You requested for reset password, kindly use this <b>${otp}</b></p> <p>OTP is valid for 5 minutes only</p>`
 
    // };
 
    // client.sendMail(mailOptions, function(error, info) {
    //     if (error) {
    //         console.log(error);
    //         return "Error " + error
    //     } else {
    //         return "Success"
    //     }
    // });

    //nodemailer documentation
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'brooke.heidenreich@ethereal.email',
        pass: 'rM9rBSRug6JrrHeEED', // generated ethereal password
      },
    });
    // console.log(testAccount.user);
    // console.log(testAccount.pass);
    // send mail with defined transport object
    const {err, info} = await transporter.sendMail({
      from: '"Anemos Energies" <admin@anemos.com>', // sender address
      to: email, // list of receivers
      subject: "OTP to Reset Password", // Subject line
      text: "OTP: "+otp + " valid for 5 minutes", // plain text body
      html: `<p>You requested for reset password, kindly use this OTP: <b>${otp}</b> to verify</p> <p>OTP is valid for 5 minutes only</p>`, // html body
    }
    // , (err, info) => {
    //   console.log("Sent here");
    //   if (err) {
    //       console.log(err);
    //       return "Error " + err
    //   } else {
    //     // console.log(info);
    //     console.log("Message sent: %s", info.messageId);
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
    //     // Preview only available when sending through an Ethereal account
    //     // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //     return "Success"
    //   }
    // }
    );
    if (err) {
        console.log(err);
        return "Error " + err
    } else {
      // console.log(info);
      // console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return "Success"
    }
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
// async function main() {
//     // Generate test SMTP service account from ethereal.email
//     // Only needed if you don't have a real mail account for testing
//     let testAccount = await nodemailer.createTestAccount();
  
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: testAccount.user, // generated ethereal user
//         pass: testAccount.pass, // generated ethereal password
//       },
//     });
  
//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: '"Fred Foo 👻" <foo@example.com>', // sender address
//       to: "bar@example.com, baz@example.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });
  
//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   }
  
//   main().catch(console.error);