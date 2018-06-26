const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Angular DIST output folder
app.use(express.static(__dirname+'/client'));


// Path to the Routes which handles the requests
const projectRoutes = require('./api/routes/projects');
const userRoutes = require('./api/routes/user');
const resourceRoutes = require('./api/routes/resources');
const taskRoutes = require('./api/routes/tasks');


// MongoDB Connection via Mongoose
mongoose.connect('mongodb://localhost/project_management_api');
mongoose.Promise = global.Promise;

// CORS
app.use(cors());
// Using morgan for logging purposes
app.use(morgan('dev')); 
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// Handing CORS errors so we can take requests from SPA (Single Page Applications)
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin","X-Requested-With","Content-Type","Accept","Authorization");
    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE');
        return res.status(200).json({})
    }
    next();
});

// use() is a middleware to pass something [data] through it
app.use('/projects',projectRoutes);
app.use('/user', userRoutes);
app.use('/resources', resourceRoutes);
app.use('/tasks',taskRoutes);


// If App reaches anywhere else but the specified paths, throw this error
app.use((req, res, next)=>{
    const error = new Error("Not Found, Check URL");
    error.status = 404;
    next(error);
});

// If there is any other error or database related errors
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

console.log("Server is Activated...");
module.exports = app;