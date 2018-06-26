const Resource = require('../models/resources');
const User = require('../models/user');
const User2 = require('../models/user');

module.exports = (req, res, next)=>{
    const id = req.params.projectId;
    const owner = req.body.projectOwner;
    const collaborater = req.body.collaboraters;
    const resource = req.body.resources;

    Resource.findOneAndUpdate({name: resource}, {$set: {status: 'Yes'}},{upsert: true,new: true}, (err, result) => {
        if  (err)
        {   
            req.statu(500).json({
                error: err
            })
            throw err;
        }
        console.log(result);
    });
    if(User.findById(id).exec().then(result =>{console.log(result);return owner}).catch() === owner){
        User.findOneAndUpdate({username: owner}, {$set: {taken: 'Yes'}}, (err, result)=>{
            if  (err)
            {
                throw err;
            }
            console.log(result);
        });
    }
    else{
        User.findOneAndUpdate({username: owner}, {$set: {taken: 'No'}}, (err, result)=>{
            if  (err)
            {
                throw err;
            }
            console.log(result);
        });
    }

    User2.findOneAndUpdate({user: collaborater}, {$set: {taken: 'Yes'}},(err,result)=>{
        if  (err)
        {
            throw err;
        }
        console.log(result);
    });
    next();

}