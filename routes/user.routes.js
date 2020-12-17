
const express = require('express');
const router  = express.Router();

const User = require('../models/User.model');
const mongoose = require('mongoose');

const fileUploader = require('../configs/cloudinary.config');


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

// Routes to edit user-profile
router.get('/user-profile/:id/edit', (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
  .then((userFromDB) => {
    res.render('users/edit-profile', userFromDB);})
  .catch((error) => next(error));
});

// Route to post edit user-profile
router.post('/user-profile/:id/edit', fileUploader.single('image'),(req, res, next) => {
  const { id } = req.params;
  const { firstname, lastname } = req.body;

  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  } else {
    imageUrl = req.body.existingImage;
  }

  User.findByIdAndUpdate(id, {firstname, lastname, imageUrl}, {new: true})
  .then(() => res.redirect('/profile'))
  .catch((error) => next(error));
});

// Route to admin page
router.get('/admin', checkAdmin, (req, res, next) => {
  User.find()
  .then((usersFromDB) => {
    res.render('users/admin', {users: usersFromDB});
  })
  .catch((error) => next(error));
});

// Admin route to delete a user
router.post('/users/:id/delete', (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
  .then(() => res.redirect('/admin'))
  .catch((error) => next(error));
});

// Admin route to edit role user
router.post('/users/:id/edit', (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  User.findByIdAndUpdate(id, {role}, {new: true})
  .then(() => res.redirect('/admin'))
  .catch((error) => next(error));
});




module.exports = router;
