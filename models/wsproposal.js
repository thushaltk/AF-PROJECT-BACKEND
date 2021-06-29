const mongoose = require('mongoose');

const wsproposalSchema = new mongoose.Schema({
    id: {type: String, required: true},
    wsProposalTitle: {type: String, required: true},
    coverImgURL: {type: String, required: true},
    authorName: {type: String, required: true},
    authorEmail: {type: String, required: true},
    wsProposalLink: {type: String, required: true}
})

module.exports = mongoose.model('WSProposal', wsproposalSchema);