const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: {type: String},
    status: {type: String, enum:['In Progress','Completed'], required: true},
    user: {type: mongoose.Schema.Types.String, ref: 'User', required: true},
    project: {type: mongoose.Schema.Types.String, ref: 'Project', required: true}
});

module.exports = mongoose.model('Task', taskSchema);
