const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
    researchPaperTitle: {type: String, required: true},
    coverImgURL: {type: String, required: true},
    authorName: {type: String, required: true},
    authorEmail: {type: String, required: true},
    researchPaperURL: {type: String, required: true}
})

module.exports = mongoose.model('Paper', paperSchema);