const mongoose = require('mongoose');

const workshopPresenterSchema = new mongoose.Schema({
        id: {type: String, required: true},
        fullName: {type: String, required: true},
        address: {type: String, required: true},
        email: {type: String, required: true},
        mobileNo: {type: String, required: true},
        wsProposalLink: {type: String, required: true},
        status: {type: String, required: true}
});

module.exports = mongoose.model('WSPresenter', workshopPresenterSchema);