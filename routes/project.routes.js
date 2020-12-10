const express = require('express');
const router = express.Router();

const Project = require('../models/Project.model');
const mongoose = require('mongoose');

// Route to project-list
router.get('/projects', (req, res, next) => {
  res.render('projects/projects-list');
});


// Routes to create a project
router.get('/apply', (req, res, next) => {
  res.render('projects/apply');
});


// Routes to edit a project

module.exports = router;

