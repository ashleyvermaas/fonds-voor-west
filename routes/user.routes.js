
const express = require('express');
const router  = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // The user is authenticated
    // and we have access to the logged user in req.user
    return next();
  } else {
    res.redirect('/login');
  }
}

// Route to user profile
router.get('/profile', (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  res.render('users/user-profile', { user: req.user });
});




module.exports = router;
