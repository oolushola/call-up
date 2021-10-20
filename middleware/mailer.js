const nodemailer = require('nodemailer')
require('dotenv').config()

exports.MAILER = async (sendTo, mailSubject, content) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    secure: true,
    port: 465,
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASSWORD,
    }
  })
  let mailOptions = {
    from: '"Olushola from Call Up!"<odejobi.olushola@kayaafrica.co>',
    to: sendTo,
    subject: mailSubject,
    html: content
    
  }
  try {
    await transporter.sendMail(mailOptions)
  }
  catch(err) {
    if(err) {
      console.log(err)
    }
  }
  
}