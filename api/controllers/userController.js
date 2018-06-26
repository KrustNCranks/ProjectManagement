const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Show all users
exports.show_users = (req, res, next)=>{
    User.find()
    .select("firstname lastname dateOfBirth email username password")
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            Users: docs.map(doc =>{
                return{
                    _id: doc._id,
                    firstname: doc.firstname,
                    lastname: doc.lastname,
                    dateOfBirth: doc.dateOfBirth,
                    email: doc.email,
                    username: doc.username,
                    password: doc.password
                }
            })
        }
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}


// User Signup or Creation
exports.user_signup = (req, res, next)=>{
    // first checks to see if an Email Exists before proceeding with the signup
    User.find({email: req.body.email}).exec()
    .then(user =>{
        if (user.length >= 1){
            return res.status(409).json({
                message: "Mail Exists!"
            });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                // Sign up proceeds from here
                if(err){
                    return res.status(500).json({error: err});
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        dateOfBirth: req.body.dateOfBirth,
                        email: req.body.email,
                        username: req.body.username,
                        password: hash
                    });
                    user.save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            })
        }
    })  
    
}



// Updating a User
exports.user_update = (req, res, next)=>{
    const id = req.params.userId;
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
            return res.status(500).json({error: err});
        }
        else{
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                dateOfBirth: req.body.dateOfBirth,
                email: req.body.email,
                username: req.body.username,
                password: hash,
                taken: req.body.taken,
            });
            User.findByIdAndUpdate({_id: id},{$set: {"firstname" : user.firstname, "lastname" : user.lastname, "dateOfBirth" : user.dateOfBirth, "email" : user["email"], "username" : user.username, "password" : user.password, "taken" : user.taken}}).exec()
                .then(result =>{
                    res.status(200).json({
                        message: "User has been Updated",
                        updatedResource: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error : err
                    });
                })
        }
    })
}



// User deletion
exports.user_delete = (req, res, next)=>{
    User.remove({_id: req.params.userId}).exec()
    .then(result =>{
        res.status(200).json({
            message: 'User Deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
}

// User Login
exports.user_login = (req, res, next)=>{
    User.find({username: req.body.username}).exec()
    .then(user =>{
        if(user.length <1){
            return res.status(401).json({
                message: 'Authentication Failed'
            });
        }
        else{
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                if(err){
                    return res.status(401).json({
                        message: 'Authentication Failed'
                    });
                }
                if (result){
                    const token = jwt.sign(
                        {
                        username: user[0].username,
                        userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                        );
                    return res.status(200).json({
                        token: token,
                        user: {
                            message: "Found"
                        }
                    });
                }
                res.status(401).json({
                    message: 'Authentication Failed'
                });
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
}
