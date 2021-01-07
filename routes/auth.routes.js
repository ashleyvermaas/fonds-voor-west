
const express = require('express');
const router  = express.Router();

const User = require('../models/User.model');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const passport = require('passport');

const nodemailer = require("nodemailer");
const templates = require('../templates/template')
const async = require('async');
const crypto = require('crypto');



// Route to signup page
router.get('/signup', (req, res, next) => res.render('auth/signup'));

// Route for posting singup
router.post('/signup', (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your first name, last name, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        firstname,
        lastname,
        email,
        passwordHash: hashedPassword
      });
    })
    .then(theUser => {
      passport.authenticate('local', { failureRedirect: "/signup"}, (err, theUser) => {
        if (err) {
          return next(err);
        }
        if (!theUser) {
          res.render('auth/signup', { errorMessage: 'There was a problem creating your account' });
          return;
        }
        req.login(theUser, err => {
          if (err) {
            return next(err);
          }
          res.redirect('/profile');
        });
      })(req, res, next);
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage: 'Email needs to be unique. This email is already registered.'
        });
      } else {
        next(error);
      }
    }); 
});

// Route to login page
router.get('/login', (req, res) => res.render('auth/login'));

// Route to check for login/post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { failureRedirect: "/login"}, (err, theUser) => {
    if (err) {
      return next(err);
    }
    if (!theUser) {
      res.render('auth/login', { errorMessage: 'Wrong password or email address' });
      return;
    }
    req.login(theUser, err => {
      if (err) {
        return next(err);
      }
      res.redirect('/profile');
    });
  })(req, res, next);
});

// Route to logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/forgot', (req, res) => {
  res.render('auth/forgot', {
    user: req.user
  });
});

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          // req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAILER_E_MAIL,
          pass: process.env.MAILER_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Fonds voor West Password Reset',
        html: ` <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <title>
              
            </title>
            <!--[if !mso]><!-- -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
              #outlook a { padding:0; }
              body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
              table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
              img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
              p { display:block;margin:13px 0; }
            </style>
            <!--[if mso]>
            <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if lte mso 11]>
            <style type="text/css">
              .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
            
          <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
            <style type="text/css">
              @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
            </style>
          <!--<![endif]-->
      
        
            
        <style type="text/css">
          @media only screen and (min-width:480px) {
            .mj-column-per-100 { width:100% !important; max-width: 100%; }
          }
        </style>
        
      
            <style type="text/css">
            
            
            </style>
            
            
          </head>
          <body style="background-color:#eeeeee;">
            
            
          <div
             style="background-color:#eeeeee;"
          >
            
          
          <!--[if mso | IE]>
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        
          
          <div  style="margin:0px auto;max-width:600px;">
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
            >
              <tbody>
                <tr>
                  <td
                     style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                  >
                    <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                
          <div
             class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
          >
            
          <table
             border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
          >
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
          <div
             style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#555555;"
          >This is the header</div>
        
                  </td>
                </tr>
              
          </table>
        
          </div>
        
              <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>
        
          
          <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        
          
          <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
            >
              <tbody>
                <tr>
                  <td
                     style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                  >
                    <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                
          <div
             class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
          >
            
          <table
             border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
          >
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
          <div
             style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#555555;"
          ><h2>Password reset</h2>
              <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
      
      Please click on the following link, or paste this into your browser to complete the process:</p>
      
        <a href="http://${req.headers.host}/reset/${token}">http://${req.headers.host}/reset/${token}</a>
      
      
      <p>If you did not request this, please ignore this email and your password will remain unchanged.
      </p></div>
        
                  </td>
                </tr>
              
          </table>
        
          </div>
        
              <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>
        
          
          <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          
          <table
             align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
          >
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
        
          
          <div  style="margin:0px auto;max-width:600px;">
            
            <table
               align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"
            >
              <tbody>
                <tr>
                  <td
                     style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                  >
                    <!--[if mso | IE]>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    
            <tr>
          
                <td
                   class="" style="vertical-align:top;width:600px;"
                >
              <![endif]-->
                
          <div
             class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
          >
            
          <table
             border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
          >
            
                <tr>
                  <td
                     align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                  >
                    
          <div
             style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#555555;"
          >This is the footer</div>
        
                  </td>
                </tr>
              
          </table>
        
          </div>
        
              <!--[if mso | IE]>
                </td>
              
            </tr>
          
                      </table>
                    <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
            
          </div>
        
          
          <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          <![endif]-->
        
        
          </div>
        
          </body>
        </html>`,
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, userFromDB) {
    if (!userFromDB) {
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('auth/reset', {
      user: userFromDB
    });
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          // req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        let newPassword = req.body.password;

        bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(newPassword, salt))
        .then(hashedPassword => {
          return User.findOneAndUpdate(
              {_id: user.id}, 
              { $set:  { 
                passwordHash: hashedPassword,
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined
              }}, 
              {useFindAndModify: false}
            );
        })
        .then(
          function(user, done) {
          console.log('Sending e-mail');
          var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAILER_E_MAIL,
              pass: process.env.MAILER_PASSWORD
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
          });
        })
        .then(() => {
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
        });
      });
    },
  ], 
  function(err) {
    console.log(err);
  });
});

// Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account',}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

// LinkedIn
router.get('/auth/linkedin',
  passport.authenticate('linkedin'),
  function(req, res){
  });

router.get('/auth/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

// Facebook
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });



module.exports = router;
