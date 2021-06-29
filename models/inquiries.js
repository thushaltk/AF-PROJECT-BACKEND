const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    id: {type: String, required: true},
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true}
})

module.exports = mongoose.model('Inquiry', inquirySchema);