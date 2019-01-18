const express = require('express');
const router = express.Router();

// Movie model
const Movie = require('../../models/Movie');

// @route GET api/movie
// @desc Get all movie
// @access Public
router.get('/', (req, res) => {
    Movie.find()
        .sort({ date: -1 })  //descending
        .then(movies => res.json(movies))
});

// @route POST api/movies
// @desc Create a movie
// @access Public
router.post('/', (req, res) => {
    const newMovie = new Movie({
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        writers: req.body.writers,
        directors: req.body.directors,
        actors: req.body.actors,
        genres: req.body.genres,
        runTime: req.body.runTime,
        rottenTomatoes: req.body.rottenTomatoes,
        imdb: req.body.imdb,
        movieRating: req.body.movieRating
    });

    newMovie.save().then(movieNight => res.json(movieNight));
});

// @route DELETE api/movieNight
// @desc Delete a movieNight
// @access Public
router.delete('/:id', (req, res) => {
    Movie.findById(req.params.id)
    .then(movie => movie.remove().then(() => res.json({success: true})))
    .catch(err => res.status(404).json({success: false}));
});

module.exports = router;