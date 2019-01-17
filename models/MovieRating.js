const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieRatingSchema = new Schema({
    person: { type: String },
    rating: { type: Number }
});

module.exports = MovieRating = mongoose.model('movieRating', MovieRatingSchema);