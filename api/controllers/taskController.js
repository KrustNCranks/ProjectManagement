const mongoose = require('mongoose');

const Task = require('../models/task');

// Shows all the Tasks
exports.show_tasks = (req, res, next)=>{
    Task.find()
    .select("name description status user project")
    .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                Tasks: docs.map(doc =>{
                    return{
                        _id: doc._id,
                        name: doc.name,
                        description: doc.dscription,
                        status: doc.status,
                        user: doc.user,
                        project: doc.project
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

// Adds a Task
exports.create_task = (req, res, next)=>{
    const task = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        user: req.body.user,
        project: req.body.project
    });
    task.save()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: "Task has been Added",
            createdResource: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

// Update a task
exports.update_task = (req, res, next)=>{
    const id = req.params.taskId;
    const name = req.body.name;
    const description = req.body.description;
    const status = req.body.status;
    const user = req.body.user;
    const project = req.body.project;

    Task.findByIdAndUpdate({_id: id}, {
        $set: {
            "name": name,
            "description": description,
            "status": status,
            "user": user,
            "project" : project
        }
    }).exec()
        .then(result => {
            res.status(200).json({
                message: "Task Successfully Modified"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

// DELETE a specific task using the ID
exports.delete_task =(req, res, next)=>{
    const id = req.params.taskId;
    Task.remove({_id: id}).exec()
    .then(result => {
        res.status(200).json({
            message: "Task Deleted"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    })
}