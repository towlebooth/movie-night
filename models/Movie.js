const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MovieSchema = new Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    imdbId: { type: String, required: true },
    tmdbId: { type: String },
    cast: [{ type: String }], // NOTE: these are tmdb.id
    crew: [{ type: String }], // NOTE: these are tmdb.id
    genres: [{
        id: { type: String }, // from tmdb
        name: { type: String }
    }],
    
    // movieRating: [{ 
    //     user: { type: Schema.Types.ObjectId, ref: 'users' },
    //     rating: { type: Number },
    //     comment: { type: String }
    //  }]
});

module.exports = Movie = mongoose.model('movie', MovieSchema);