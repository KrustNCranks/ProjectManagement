const mongoose = require('mongoose');

const Project = require('../models/projects');
const Resource = require('../models/resources');
const User = require('../models/user');
const User2 = require('../models/user');

// GET This will Show All Projects
exports.projects_get_all = (req, res, next)=>{
    Project.find()
    .select("name projectDescription startDate deadline projectOwner collaboraters resources")
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            Projects: docs.map(doc =>{
                return{
                    _id: doc._id,
                    name: doc.name,
                    description: doc.projectDescription,
                    startDate: doc.startDate,
                    deadline: doc.deadline,
                    owner: doc.projectOwner,
                    collaboraters: doc.collaboraters,
                    resources: doc.resources
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

 // POST This will post to projects
 exports.projects_create = (req, res, next)=>{
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        projectDescription: req.body.projectDescription,
        startDate: req.body.startDate,
        deadline: req.body.deadline,
        projectOwner: req.body.projectOwner,
        collaboraters: req.body.collaboraters,
        resources: req.body.resources
    })    
    project.save()
    .then(result =>{
        console.log(result);
        const owner = req.body.projectOwner;
        const collaborater = req.body.collaboraters;
        const resource = req.body.resources;
        Resource.findOneAndUpdate({name: resource}, {$set: {status: 'No'}}, (err, result) => {            
            if  (err)
            {
                throw err;
            }
            console.log(result);
        });
        User.findOneAndUpdate({username: owner}, {$set: {taken: 'Yes'}}, (err, result)=>{
            if  (err)
            {
                throw err;
            }
            console.log(result);
        });
        User2.findOneAndUpdate({username: collaborater}, {$set: {taken: 'Yes'}},(err,result)=>{
            if  (err)
            {
                throw err;
            }
            console.log(result);
        });
        res.status(200).json({
            message: "Project Created",
            createdProject: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

// GET a specific project using the ID
exports.project_get_project = (req, res, next)=>{
    const id = req.params.projectId;
    Project.findById(id)
    .select("name projectDescription startDate deadline projectOwner collaborater resources")
    .exec()
    .then(doc =>{
        console.log("From The Database", doc);
        // If a Valid ID has been entered but with no data
        if (doc){            
            res.status(200).json({
                _id: doc._id,
                    name: doc.name,
                    description: doc.projectDescription,
                    startDate: doc.startDate,
                    deadline: doc.deadline,
                    owner: doc.projectOwner,
                    collaborater: doc.collaborater,
                    resources: doc.resources
            });
        }
        else{
            res.status(404).json({message:"No Valid Entry was Found For Provided ID!"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
}


// UPDATE a specific project using the ID
exports.project_update = (req, res, next)=> {
    const id = req.params.projectId;
    const name = req.body.name;
    const projectDescription = req.body.projectDescription;
    const startDate = req.body.startDate;
    const deadline = req.body.deadline;
    const projectOwner = req.body.projectOwner;
    const collaboraters = req.body.collaboraters;
    const resources = req.body.resources;

    Project.findByIdAndUpdate({_id: id}, {
        $set: {
            "name": name,
            "projectDescription": projectDescription,
            "startDate": startDate,
            "deadline": deadline,
            "projectOwner": projectOwner,
            "collaboraters": collaboraters,
            "resources": resources
        }
    }).exec()
        .then(result => {
            res.status(200).json({
                message: "Project Successfully Modified",
                modifiedProject: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}



// DELETE a specific project using the ID
exports.project_delete =(req, res, next)=>{
    const id = req.params.projectId;

    const owner = req.body.projectOwner;
    const collaboraters = req.body.collaboraters;
    const resources = req.body.resources;

    Resource.findOneAndUpdate({name: resources}, {$set: {status: 'Yes'}}, (err, result) => {
        if  (err)
        {
            throw err;
        }
        console.log(result);
    });
    User.findOneAndUpdate({username: owner}, {$set: {taken: 'No'}}, (err, result)=>{
        if  (err)
        {
            throw err;
        }
        console.log(result);
    });
    User2.findOneAndUpdate({username: collaboraters}, {$set: {taken: 'No'}},(err,result)=>{
        if  (err)
        {
            throw err;
        }
        console.log(result);
    });

    Project.remove({_id: id}).exec()
    .then(result => {
        res.status(200).json({
            message: "Project Deleted"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    })
}



