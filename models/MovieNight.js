const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieNightSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    host: { type: String },
    location: { type: String },
    movieChoicesRoundOne: [{ type: Schema.Types.ObjectId, ref: 'movie' }],
    movieChoicesRoundTwo: [{ type: Schema.Types.ObjectId, ref: 'movie' }],
    movieChoicesRoundThree: [{ type: Schema.Types.ObjectId, ref: 'movie' }],
    movieViewed: { type: Schema.Types.ObjectId, ref: 'movie' },
    movieVotesRoundOne: [{
        voter: { type: Schema.Types.ObjectId, ref: 'users' },
        movie: { type: Schema.Types.ObjectId, ref: 'movie' }
    }],
    movieVotesRoundTwo: [{
        voter: { type: Schema.Types.ObjectId, ref: 'users' },
        movie: { type: Schema.Types.ObjectId, ref: 'movie' }
    }],
    movieVotesRoundThree: [{
        voter: { type: Schema.Types.ObjectId, ref: 'users' },
        movie: { type: Schema.Types.ObjectId, ref: 'movie' }
    }]
});

module.exports = MovieNight = mongoose.model('movieNight', MovieNightSchema);