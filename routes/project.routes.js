const express = require('express');
const router = express.Router();

const Project = require('../models/Project.model');
const mongoose = require('mongoose');

// Route to projects-list
router.get('/projects', (req, res, next) => {
  const { _id } = req.user;
  Project.find({ owner: _id })
  .then((projectsFromDB) => {
    res.render('projects/projects-list', {projects: projectsFromDB});
  })
  .catch((error) => next(error));
});

// Routes to create project
router.get('/create', (req, res, next) => {
  res.render('projects/create');
});

router.post('/create', (req, res, next) => {
  const { name, date, location, description } = req.body;
  const { _id } = req.user;

  if (!name || !date || !location || !description) {
    res.render('projects/create', req.user, {errorMessage: 'All fields are mandatory. Please provide answers for all fields'});
    return;
  }

  Project.create({
    name, 
    date, 
    location, 
    description,
    owner: _id,
  })
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

// Route to project details
router.get('/projects/:id/details', (req, res, next) => {
  const { id } = req.params;

  Project.findById(id)
  .then((projectFromDB) => res.render('projects/details', projectFromDB))
  .catch((error) => next(error));
});

// Routes to evaluate 
router.get('/projects/:id/evaluate', (req, res, next) => {
  const { id } = req.params;

  Project.findById(id)
  .then((projectFromDB) => res.render('projects/evaluate', projectFromDB))
  .catch((error) => next(error));
});

router.post('/projects/:id/evaluate', (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  Project.findByIdAndUpdate(id, req.body, {new: true})
  .then((projectFromDB) => res.render('projects/details', projectFromDB))
  .catch((error) => next(error));
});


// Route to view accountability
router.get('/projects/:id/accountable', (req, res, next) => {
  const { id } = req.params;

  Project.findById(id)
  .then((projectFromDB) => res.render('projects/accountable', projectFromDB))
  .catch((error) => next(error));
});


// Route to submit accountability 
router.post('/projects/:id/accountable', (req, res, next) => {
  const { id } = req.params;
  const { accountability } = req.body;

  if(!accountability){
    res.render('projects/accountable', {errorMessage: 'All fields are mandatory. Please provide answers for all fields'});
    return;
  }

  Project.findByIdAndUpdate(id, req.body, {new: true})
  .then((projectFromDB) => res.render('projects/details', projectFromDB))
  .catch((error) => next(error));
});


// Routes to edit accountability
router.get('/projects/:id/accountable/edit', (req, res, next) => {
  const { id } = req.params;
  const { accountability } = req.body;

  Project.findById(id)
  .then((projectFromDB) => res.render('projects/accountable-edit', projectFromDB))
  .catch((error) => next(error));
});

router.post('/projects/:id/accountable/edit', (req, res, next) => {
  const { id } = req.params;
  const { accountability } = req.body;

  Project.findByIdAndUpdate(id, req.body, {new: true})
  .then((projectFromDB) => res.render('projects/accountable', projectFromDB))
  .catch((error) => next(error));
});


module.exports = router;

