const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = require('./Movie');

const MovieVoteSchema = new Schema({
    voter: { type: String },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }
});

module.exports = Movie = mongoose.model('movieVote', MovieVoteSchema);