
const express = require('express');
const router  = express.Router();

const User = require('../models/User.model');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const saltRounds = 10;


// Route to singup page
router.get('/signup', (req, res) => res.render('auth/signup'));

// Route for posting singup
router.post('/signup', (req, res) => {
  const {firstname, lastname, email, password} = req.body;

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
  .then(res.redirect('/profile'))
  .catch();
});



// Route to login page
router.get('/login', (req, res) => res.render('auth/login'));

// Route to check for login/post
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
          // req.session.currentUser = user;
          res.redirect('/profile');
      } else {
        res.render('auth/login', { userDetails: {email, password}, errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

// Route to user profile
router.get('/profile', (req, res) => res.render('auth/profile'));


module.exports = router;
