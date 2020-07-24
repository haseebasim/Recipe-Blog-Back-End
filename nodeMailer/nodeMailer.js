"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(msg,subject) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: process.env.NODEMAILER_EMAIL, // generated ethereal user
      pass: process.env.NODEMAILER_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"SZfood" <${process.env.NODEMAILER_EMAIL}>`, // sender address
    to: process.env.NODEMAILER_EMAIL, // list of receivers
    subject: subject, // Subject line
    html: msg, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

const sendEmail = (msg,subject) => {
  main(msg, subject).catch(console.error);
};

module.exports = sendEmail