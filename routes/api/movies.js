const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load validation
const validateMovieInput = require('../../validation/movie');

// Movie model
const Movie = require('../../models/Movie');

// @route GET api/movie
// @desc Get all movie
// @access Public
router.get('/', (req, res) => {
    Movie.find()
        .sort({ releaseDate: -1 })  //descending
        .then(movies => res.json(movies))
});

// @route POST api/movies
// @desc Create a movie
// @access Public
router.post(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        const { errors, isValid } = validateMovieInput(req.body);

        // check validation
        if(!isValid) {
            // return any errors with 400 status
            return res.status(400).json(errors);
        }
        const movieFields = {};
        //movieFields.user = req.user.id;
        if(req.body.title) movieFields.title = req.body.title;
        if(req.body.releaseDate) movieFields.releaseDate = req.body.releaseDate;
        if(req.body.runTime) movieFields.runTime = req.body.runTime;

        console.log('writers: ' + req.body.writers);
        // writers - split into array
        if(typeof req.body.writers !== 'undefined') {
            movieFields.writers = req.body.writers.split(',');
        }
        // directors - split into array
        if(typeof req.body.directors !== 'undefined') {
            movieFields.directors = req.body.directors.split(',');
        }
        // actors - split into array
        if(typeof req.body.actors !== 'undefined') {
            movieFields.actors = req.body.actors.split(',');
        }
        // genres - split into array
        if(typeof req.body.genres !== 'undefined') {
            movieFields.genres = req.body.genres.split(',');
        }

        // rottenTomatoes
        movieFields.rottenTomatoes = {};        
        if(req.body.urlKey) movieFields.rottenTomatoes.urlKey = req.body.urlKey;
        if(req.body.tomatoMeter) movieFields.rottenTomatoes.tomatoMeter = req.body.tomatoMeter;
        if(req.body.audienceScore) movieFields.rottenTomatoes.audienceScore = req.body.audienceScore;

        // imdb
        movieFields.imdb = {};        
        if(req.body.imdbId) movieFields.imdb.imdbId = req.body.imdbId;
        if(req.body.imdbRating) movieFields.imdb.imdbRating = req.body.imdbRating;

        // movieRating
        movieFields.movieRating = {};        
        if(req.body.user) movieFields.movieRating.user = req.user.id;
        if(req.body.rating) movieFields.movieRating.rating = req.body.rating;
        if(req.body.comment) movieFields.movieRating.comment = req.body.comment;

        Movie.findOne({ title: req.body.title })
            .then(movie => {
                if(movie) {
                    console.log('Movie exists: ' + movie)
                    // update
                    Movie.findOneAndUpdate(
                        { title: req.body.title },
                        { $set: movieFields }, 
                        { new: true }
                    )
                    .then(movie => res.json(movie));
                } else { // create
                    // check if title exists
                    Movie.findOne({ title: movieFields.title })
                        .then(movie => {
                            if(movie) {
                                errors.handle = 'That movie title already exists';
                                res.status(400).json(errors);
                            }

                            // save Movie
                            new Movie(movieFields).save().then(movie => res.json(movie));
                        }
                    );
                }
            });
/*
        const newMovie = new Movie({
            rottenTomatoes: req.body.rottenTomatoes,
            imdb: req.body.imdb,
            movieRating: req.body.movieRating
        });

        newMovie.save().then(movieNight => res.json(movieNight));
        */
    }
);

// @route DELETE api/movieNight
// @desc Delete a movieNight
// @access Public
router.delete('/:id', (req, res) => {
    Movie.findById(req.params.id)
    .then(movie => movie.remove().then(() => res.json({success: true})))
    .catch(err => res.status(404).json({success: false}));
});

module.exports = router;