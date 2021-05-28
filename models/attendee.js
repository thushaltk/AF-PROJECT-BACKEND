const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    uid: {type: String, required: true},
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    email: {type: String, required: true},
    mobileNo: {type: String, required: true},
    isPaid: {type: String, required: true}
});


module.exports = mongoose.model('Attendee', attendeeSchema);