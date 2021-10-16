const nodemailer = require('nodemailer')
require('dotenv').config()

exports.MAILER = async (sendTo, mailSubject, content) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  })
  let mailOptions = {
    from: '"Uyi from Call Up" <noreply@callup.ng>',
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