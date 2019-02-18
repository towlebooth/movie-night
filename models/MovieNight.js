const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieNightSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    host: { type: String },
    location: { type: String },
    movieChoicesRoundOne: [{ type: String }],
    movieChoicesRoundTwo: [{ type: String }],
    movieChoicesRoundThree: [{ type: String }],
    movieViewed: { type: String },
    movieVotesRoundOne: [{
        voter: { type: Schema.Types.ObjectId, ref: 'users' },
        movie: { type: String }
    }],
    movieVotesRoundTwo: [{
        voter: { type: Schema.Types.ObjectId, ref: 'users' },
        movie: { type: String }
    }],
    movieVotesRoundThree: [{
        voter: { type: Schema.Types.ObjectId, ref: 'users' },
        movie: { type: String }
    }]
});

module.exports = MovieNight = mongoose.model('movieNight', MovieNightSchema);