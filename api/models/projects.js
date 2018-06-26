const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    projectDescription: {type: String},
    startDate: {type: Date, required: true},
    deadline: {type: Date, required: true},
    projectOwner: {type: mongoose.Schema.Types.String, ref: 'User', required: true},
    collaboraters: {type: mongoose.Schema.Types.String, ref: 'User'},
    resources: {type: mongoose.Schema.Types.String, ref: 'Resource'}
});

module.exports = mongoose.model('Project', projectSchema);