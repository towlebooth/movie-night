const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MovieSchema = new Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    imdbId: { type: String, required: true },
    tmdbId: { type: String },
    // writers: [String],
    // directors: [String],
    // actors: [String],
    // genres: [String],
    // runTime: { type: Number },
    // posterUrl: { type: String },
    // rottenTomatoesUrlKey: {type: String},
    // rottenTomatoesTomatoMeter: { type: Number},
    // rottenTomatoesAudienceScore: { type: Number},
    // imdbId: { type: String },
    // imdbRating: { type: Number },
    // movieRating: [{ 
    //     user: { type: Schema.Types.ObjectId, ref: 'users' },
    //     rating: { type: Number },
    //     comment: { type: String }
    //  }]
});

module.exports = Movie = mongoose.model('movie', MovieSchema);