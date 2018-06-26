const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/authentication');
// using JSON web tokens to send something similar to a sessions since RESTapis are stateless

const taskController = require('../controllers/taskController');

// Shows all Tasks
router.get('/',checkAuth,taskController.show_tasks);

// Adding a Task
router.post('/',checkAuth,taskController.create_task);

// Update a Task
router.patch('/:taskId',checkAuth,taskController.update_task);

// Task Deletion
router.delete('/:taskId',checkAuth,taskController.delete_task);

module.exports = router;