const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    id: {type: String, required: true},
    topicTitle: {type: String, required: true},
    description: {type: String, required: true},
    coverImgURL: {type: String, required: true},
    status: {type: String, required: true}
})

module.exports = mongoose.model('Topic', topicSchema);