const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
    id: {type: String, required: true},
    topic: {type: String, required: true},
    description: {type: String, required: true},
    conductor: {type: String, required: true}
});

module.exports = mongoose.model("Workshop", workshopSchema);