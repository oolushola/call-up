const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.WELCOME_EMAIL = (id, name, token) => {
  const verificationURL = `${process.env.URL}${process.env.BASE_URL}/auth/is/click?token=${token}`;

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
          <section style="max-height: 700px; margin: auto; width: 700px; font-size: 12px; margin-top: 10px; text-align: justify; color: #333;">
            <div style="padding: 10px; margin: 10px 0;">
              <p><strong style="font-weight: bold; text-transform:capitalize">Dear ${name}, </strong></p>
              <p>Congratulations & thank you for becoming a part of call up!</p>
              <p>You now have unparralled access to the biggest and most reliable trucking platform in Nigeria. As part of our commitment, resolve and collaboration with the federal republic of Nigeria to ease the gridlock situation in and around Apapa, you have been credited five thousand naira worth of voucher. At call up, we are changing the narrative of truck movement in Africa by using technology,  physical infrastructure and man management systems to reduce traffic challenges. Here are some of the benefits we offer: </p>
              
              <p>You can learn more about us on our website <a href="${process.env.URL}">Call Up</a></p>
      
              <p>Want to reach out? We are available 24/7 to to respond to your request via any of our channels</p>
      
              <p>Email: <a href="mailto:info@callup.ng">info@callup.ng</a></p>
              <p>Telephone: <a href="tel:+2348022440810">+2348022440810</a>, <a href="tel:+2348028955866">+2348028955866</a></p>
              <p>Office Address: 3A Gbenga Ademulegun Lane, Parkview, Ikoyi, Lagos.</p>
      
              <p>Social media platforms: Facebook, Twitter , Instagram, and LinkedIn. </p>
      
              <p>We thank you for giving us the opportunity to be of service to you. </p>
      
              <p style="margin-bottom: 30px;">Excited? Kindly click below button to complete your activate your account. Please note, this link expires 30 minutes.</p>
      
              <a href="${verificationURL}" style="text-decoration: none; background: #3498db; padding: 10px; font-weight: bold; border-radius: 5px; position: relative; left: 300px; color: #fff;">CLICK HERE TO PROCEED</a>
      
              <p style="text-align: start; margin-top: 30px">If you’re having trouble clicking the "Click Here" button, copy and paste the URL below into your web browser: <a href="${verificationURL}">${verificationURL}</a></p>
            </div>
            <footer style="height: 160px; background: #ccc; padding: 4px; text-align: center;">
              <p>Copyright &copy; 2021, Mailchimp, All rights reserved.</p>
      
              <p>Our mailing address is:<br />
              Call Up<br />
              3A Gbenga Ademulegun, Lane,  <br />
              Parkview, Ikoyi,<br />
              Lagos, NG 100101</p>
      
              <p>You're receiving this email because you have a Mailchimp account and we are required to notify you about these changes.</p>
            </footer>
          </section>
          
        </main>
      </body>
    </html>
  `;
};
