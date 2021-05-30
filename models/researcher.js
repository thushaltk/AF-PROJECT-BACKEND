const mongoose = require('mongoose');

const researcherSchema = new mongoose.Schema({
        id: {type: String, required: true},
        fullName: {type: String, required: true},
        address: {type: String, required: true},
        email: {type: String, required: true},
        mobileNo: {type: String, required: true},
        isPaid: {type: String, required: true},
        researchPaperURL: {type: String, required: true},
        status: {type: String, required: true},
});

module.exports = mongoose.model('Researcher', researcherSchema);