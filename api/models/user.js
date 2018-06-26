const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    dateOfBirth: {type: Date},
    email: {type: String, required: true, unique: true, 
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    taken: {type: String, default: 'No'}
});

// using mongoose's virtual property to find the user's age
userSchema.virtual('name').get(function(){
    let ageDifference = Date.now() - this.dateOfBirth.getTime();
    let age = new Date(ageDifference);
    return Math.abs(age.getUTCFullYear() - 1970);
});

module.exports = mongoose.model('User', userSchema);