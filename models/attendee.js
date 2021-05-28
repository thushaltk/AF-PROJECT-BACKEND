const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    email: {type: String, required: true},
    mobileNo: {type: String, required: true}
});


module.exports = mongoose.model('Attendee', attendeeSchema);