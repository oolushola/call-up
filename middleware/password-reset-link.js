const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.PASSWORD_RESET = (name, operatingSystem, browserName, userType,  cryptoLink, token) => {
  const passwordResetLink = `${process.env.URL}${process.env.BASE_URL}/auth/prl/update?crypt=${cryptoLink}&upd=${token}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600&display=swap" rel="stylesheet">
      
        <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Titillium+Web&display=swap" rel="stylesheet">
      
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Titillium Web', sans-serif;
          }
          a {
            color: #9b59b6;
            text-decoration: none;
          }
          p {
            line-height: 18px;
          }
        </style>
      </head>
      <body>
        <main>
          <section style="max-height: 700px; margin: auto; width: 700px; font-size: 13px; margin-top: 10px; text-align: justify; color: #333;">
            <div style="padding: 10px; margin: 10px 0;">
              <h3><strong style="font-weight: bold; text-transform:capitalize">Hi ${name}, </strong></h3>
              
              <p>You recently requested to reset your password for your call up ${userType} account. Use the button below to reset it. <b>This password reset is only valid for the next 24 hours </b></p>
              
              <a href="${passwordResetLink}" style="text-decoration: none; background: #3498db; padding: 10px; font-weight: bold; border-radius: 5px; position: relative; left: 300px; color: #fff;">CLICK HERE TO PROCEED</a>

              <p>For security, this request was received from a ${ operatingSystem } device, using ${ browserName }. If you did not request password reset, please ignore this email or <a href="http://www.call-up.ng/support">contact support</a> if you have questions. </p>

              <p>Thanks,</p>
              <p>The Call Up Team</p>

      
            </div>
            <footer style="height: 160px; background: #ccc; padding: 4px; text-align: center;">
              <p>Copyright &copy; 2021, call up, All rights reserved.</p>
      
              <p>Our mailing address is:<br />
              Call Up<br />
              3A Gbenga Ademulegun, Lane,  <br />
              Parkview, Ikoyi,<br />
              Lagos, NG 100101</p>
      
              <p>You're receiving this email because you have a call up account and we are required to notify you about these changes.</p>
            </footer>
          </section>
          
        </main>
      </body>
    </html>
  `;
};
