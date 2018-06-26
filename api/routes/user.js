const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/authentication');
const jwt = require('jsonwebtoken');
// using JSON web tokens to send something similar to a sessions since RESTapis are stateless

const User = require('../models/user');
const userController = require('../controllers/userController');

// Show All users
router.get('/',checkAuth, userController.show_users);

// User Signup or Creation
router.post('/signup',userController.user_signup);

// User Update
router.patch('/:userId',checkAuth,userController.user_update);

// User Deletion
router.delete('/:userId',checkAuth,userController.user_delete);

// User Login
router.post('/login', userController.user_login);

module.exports = router;
