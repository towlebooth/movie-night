const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReleaseNoteSchema = new Schema({
    date: { type: Date, default: Date.now, required: true },
    title: { type: String, required: true },
    notes: [{ type: String, required: true }]
});

module.exports = ReleaseNote = mongoose.model('releaseNote', ReleaseNoteSchema);