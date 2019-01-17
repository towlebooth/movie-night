const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RottenTomatoesSchema = new Schema({
    urlKey: { type: String },
    tomatoMeter: { type: Number},
    audienceScore: { type: Number}
});

module.exports = RottenTomatoes = mongoose.model('rottenTomatoes', RottenTomatoesSchema);