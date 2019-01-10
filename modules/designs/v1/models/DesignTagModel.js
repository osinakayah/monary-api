const mongoose   = require('mongoose');
const Schema = mongoose.Schema;

const designTagSchema = new Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('DesignTag', designTagSchema);
