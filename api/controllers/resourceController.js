const mongoose = require('mongoose');

const Resource = require('../models/resources');

// Show all resources
exports.show_resources = (req, res, next)=>{
    Resource.find()
        .select("name type status")
        .exec()
        .then(docs =>{
            const response = {
                count: docs.length,
                resources: docs.map(doc=>{
                    return{
                        name: doc.name,
                        type: doc.type,
                        status: doc.status
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
// CREATE a resource
exports.resource_create = (req, res, next)=>{
    const resource = new Resource({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type
    });
    resource.save()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: "Resource Created",
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

// UPDATE a specific resource using the ID
exports.resource_update = (req, res, next)=>{
    const id = req.params.resourceId;
    const name = req.body.name;
    const type = req.body.type;
    const status = req.body.status;
    Resource.findByIdAndUpdate({_id: id},{$set: {"name" : name, "type" : type, "status" : status}}).exec()
        .then(result =>{
            res.status(200).json({
                message: "Resource Updated"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        })
}


// DELETE a specific resource using the ID
exports.resource_delete =(req, res, next)=>{
    const id = req.params.resourceId;
    Resource.remove({_id: id}).exec()
    .then(result => {
        res.status(200).json({
            message: "Resource Deleted"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    })
}


// Get a specific resource by ID
exports.resource_get_specific = (req, res, next)=>{
    const id = req.params.resourceId;
    Resource.findById(id)
    .select("name type status")
    .exec()
    .then(doc =>{
        console.log("From The Database", doc);
        // If a Valid ID has been entered but with no data
        if (doc){            
            res.status(200).json({
                    _id: doc._id,
                    name: doc.name,
                    type: doc.type,
                    status: doc.status                    
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