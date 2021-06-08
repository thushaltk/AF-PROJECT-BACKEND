const mongoose = require('mongoose');


const reviewerSchema = new mongoose.Schema({
    id: {type: String, required: true},
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    email: {type: String, required: true},
    mobileNo: {type: String, required: true},
    password: {type: String},

});
    
module.exports = mongoose.model('Reviewer', reviewerSchema);