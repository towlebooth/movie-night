const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const MovieSchema = require('./Movie');
//const MovieVoteSchema = require('./MovieVote');

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
    runTime: { type: Number }
    //rottenTomatoes: { type: mongoose.Schema.Types.ObjectId, ref: 'RottenTomatoes' },
    //imdb: { type: mongoose.Schema.Types.ObjectId, ref: 'Imdb' },
    //movieRating: { type: mongoose.Schema.Types.ObjectId, ref: 'MovieRating' }
});

const MovieNightSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    host: { type: String },
    location: { type: String },
    //movieChoices: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    movieViewed: { type: MovieSchema },
    //movieVotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'MovieVote'}]
});




module.exports = MovieNight = mongoose.model('movieNight', MovieNightSchema);