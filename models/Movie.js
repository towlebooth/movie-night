const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const RottenTomatoes = require('./RottenTomatoes');
//const ImdbSchema = require('./Imdb');
//const MovieRatingSchema = require('./MovieRating');

// Create Schema
const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date
    },
    writers: [String],
    directors: [String],
    actors: [String],
    genres: [String],
    runTime: { type: Number },
    rottenTomatoes: { type: mongoose.Schema.Types.ObjectId, ref: 'RottenTomatoes' },
    imdb: { type: mongoose.Schema.Types.ObjectId, ref: 'Imdb' },
    movieRating: { type: mongoose.Schema.Types.ObjectId, ref: 'MovieRating' }
});

module.exports = Movie = mongoose.model('movie', MovieSchema);