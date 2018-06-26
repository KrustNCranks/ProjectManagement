const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    type: {type: String, required: true},
    status: {type: String, enum:['Yes','No'], default: 'Yes',required: true}
});

module.exports = mongoose.model('Resource', resourceSchema);
