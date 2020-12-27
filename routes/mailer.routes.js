
const express = require('express');
const router  = express.Router();

const nodemailer = require("nodemailer");


router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAILER_E_MAIL,
      pass: process.env.MAILER_PASSWORD
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project " <myawesome@project.com>',
    to: email, 
    subject: subject, 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => res.render('users/message', {email, subject, message, info}))
  .catch(error => console.log(error));
});


module.exports = router;
