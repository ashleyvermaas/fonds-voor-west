const express = require('express');
const router  = express.Router();

// Route to home page 
router.get('/', (req, res, next) => {
  res.render('index', {layout: 'main2'});
});

module.exports = router;
