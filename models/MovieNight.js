const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieNightSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    host: { type: String },
    location: { type: String },
    movieChoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    movieViewed: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    movieVotes: [{
        voter: { type: String },
        movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
    }]
});

module.exports = MovieNight = mongoose.model('movieNight', MovieNightSchema);