const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImdbSchema = new Schema({
    imdbId: { type: Number },
    imdbRating: { type: Number }
});

module.exports = Imdb = mongoose.model('imdb', ImdbSchema);