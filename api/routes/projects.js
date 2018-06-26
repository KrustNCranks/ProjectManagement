const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userTaken = require('../middleware/userTakenUpdate');
const checkAuth = require('../middleware/authentication');
// using JSON web tokens to send something similar to a sessions since RESTapis are stateless

// Importing the projects file in the Models folder
const Project = require('../models/projects');
const ProjectController = require('../controllers/projectController');

// GET This will Show All Projects
router.get('/',checkAuth,ProjectController.projects_get_all);

// POST This will post to projects
router.post('/',checkAuth, ProjectController.projects_create);

// GET a specific project using the ID
router.get('/:projectId',checkAuth, ProjectController.project_get_project);


// UPDATE a specific project using the ID
router.patch('/:projectId',userTaken,ProjectController.project_update);

// DELETE a specific project using the ID
router.delete('/:projectId',checkAuth, ProjectController.project_delete);

module.exports = router;