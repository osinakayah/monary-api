const mongoose   = require('mongoose');
const Schema = mongoose.Schema;

const designSchema = new Schema({
    name: { type: String, required: true },
    posterName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    posterId:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, required: true, default: 0 },
    designTags : [{ type: Schema.Types.ObjectId, ref: 'DesignTag' }]
}, {timestamps: true});

module.exports = mongoose.model('Design', designSchema);
