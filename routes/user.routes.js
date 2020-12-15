
const express = require('express');
const router  = express.Router();

const User = require('../models/User.model');
const mongoose = require('mongoose');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // The user is authenticated
    // and we have access to the logged user in req.user
    return next();
  } else {
    res.redirect('/login');
  }
}

const checkRoles = role => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === role) {
    return next();
  } else {
    res.redirect('/login');
  }
};

const checkAdmin = checkRoles('ADMIN');

// Route to user profile
router.get('/profile', (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  res.render('users/user-profile', { user: req.user });
});



// Route to admin page
router.get('/admin', checkAdmin, (req, res, next) => {
  User.find()
  .then((usersFromDB) => {
    console.log(usersFromDB)
    res.render('users/admin', {users: usersFromDB});
  })
  .catch((error) => next(error));
});

// Route to delete a user
router.post('/users/:id/delete', (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
  .then(() => res.redirect('/admin'))
  .catch((error) => next(error));
});

router.post('/users/:id/edit', (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  User.findByIdAndUpdate(id, {role}, {new: true})
  .then(() => res.redirect('/admin'))
  .catch((error) => next(error));
});

// Routes to settings
router.get('/settings', (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  res.render('users/settings', { user: req.user });
});

router.post('/settings', (req, res, next) => {
  const { _id } = req.user;
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    res.render('users/settings', { errorMessage: 'All fields are mandatory. Please provide your first name, last name, email and password.' });
    return;
  }

  User.findByIdAndUpdate(_id, req.body, {new: true})
  .then(() => res.redirect('/profile'))
  .catch((error) => next(error));
});



module.exports = router;
