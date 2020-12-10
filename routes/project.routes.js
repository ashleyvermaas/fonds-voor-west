const express = require('express');
const router = express.Router();

const Project = require('../models/Project.model');
const mongoose = require('mongoose');

// Route to project-list
router.get('/projects', (req, res, next) => {
  Project.find()
  .then((projectsFromDB) => {
    res.render('projects/projects-list', {projects: projectsFromDB});
  })
  .catch((error) => next(error));
});

// Routes to apply project
router.get('/apply', (req, res, next) => {
  res.render('projects/apply');
});

router.post('/apply', (req, res, next) => {
  const { name, date, location, description } = req.body;

  Project.create(req.body)
  .then(() => res.redirect('/projects'))
  .catch((error) => next(error));
});

// Route to delete a project
router.post('/projects/:id/delete', (req, res, next) => {
  const { id } = req.params;

  Project.findByIdAndDelete(id)
  .then(() => res.redirect('/projects'))
  .catch((error) => next(error));
});

// Routes to edit a project
router.get('/projects/:id/edit', (req, res, next) => {
  const { id } = req.params;
  
  Project.findById(id)
  .then((projectFromDB) => {
    console.log(projectFromDB); 
    res.render('projects/edit', projectFromDB);})
  .catch((error) => next(error));
});

router.post('/projects/:id/edit', (req, res, next) => {
  const { id } = req.params;
  const { name, date, location, description } = req.body;

  Project.findByIdAndUpdate(id, req.body, {new: true})
  .then(() => res.redirect('/projects'))
  .catch((error) => next(error));
});

module.exports = router;

