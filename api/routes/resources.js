const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/authentication');
// using JSON web tokens to send something similar to a sessions since RESTapis are stateless

const resourceController = require('../controllers/resourceController');

// Show All Resources
router.get('/',checkAuth,resourceController.show_resources);

// Get Specific resource by ID
router.get('/:resourceId',checkAuth,resourceController.resource_get_specific);

// Adding a resource
router.post('/',checkAuth,resourceController.resource_create);

// Updating a resource
router.patch('/:resourceId',checkAuth,resourceController.resource_update);

// Resource Deletion
router.delete('/:resourceId',checkAuth,resourceController.resource_delete);

module.exports = router;