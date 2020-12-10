
const express = require('express');
const router  = express.Router();

// Route to user profile
router.get('/profile', (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  res.render('users/user-profile', { user: req.user });
});

module.exports = router;
