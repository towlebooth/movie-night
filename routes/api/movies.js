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

// @route   GET api/movies/all
// @desc    Get all movies
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};
  
    Movie.find()
      .populate('user', ['name', 'avatar'])
      .then(movies => {
        if (!movies) {
          errors.nomovie = 'There are no movies';
          return res.status(404).json(errors);
        }
  
        res.json(movies);
      })
      .catch(err => res.status(404).json({ movies: 'There are no movies' }));
  });

// @route   GET api/movie/title/:title
// @desc    Get movie by title
// @access  Public
router.get('/title/:title', (req, res) => {
    const errors = {};
    Movie.findOne({ title: req.params.title })
      .then(movie => {
        if (!movie) {
          errors.nomovie = 'There is no movie with this title: ' + req.params.title;
          res.status(404).json(errors);
        }
  
        res.json(movie);
      })
      .catch(err => res.status(404).json(err));
  });

// @route   GET api/movie/:movie_id
// @desc    Get movie by id
// @access  Public
router.get('/:movie_id', (req, res) => {
    const errors = {};
  
    Movie.findOne({ _id: req.params.movie_id })
      //.populate('user', ['name', 'avatar'])
      .then(movie => {
        if (!movie) {
          errors.nomovie = 'There is no movie with this id: ' + req.params.movie_id;
          res.status(404).json(errors);
        }
  
        res.json(movie);
      })
      .catch(err => res.status(404).json(err));
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
        if(req.body.posterUrl) movieFields.posterUrl = req.body.posterUrl;

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
        if(req.body.rottenTomatoesUrlKey) movieFields.rottenTomatoes.urlKey = req.body.rottenTomatoesUrlKey;
        if(req.body.rottenTomatoesTomatoMeter) movieFields.rottenTomatoes.tomatoMeter = req.body.rottenTomatoesTomatoMeter;
        if(req.body.rottenTomatoesAudienceScore) movieFields.rottenTomatoes.audienceScore = req.body.rottenTomatoesAudienceScore;

        // imdb
        movieFields.imdb = {};        
        if(req.body.imdbId) movieFields.imdb.imdbId = req.body.imdbId;
        if(req.body.imdbRating) movieFields.imdb.imdbRating = req.body.imdbRating;

        // movieRating
        // TODO: THIS SEEMS INCORRECT - ARRAY OF THESE?  SEPERATE JOIN THING?
        movieFields.movieRating = {};        
        if(req.body.user) movieFields.movieRating.user = req.user.id;
        if(req.body.rating) movieFields.movieRating.rating = req.body.rating;
        if(req.body.comment) movieFields.movieRating.comment = req.body.comment;

        Movie.findOne({ title: req.body.title })
            .then(movie => {
                if(movie) {
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

// @route DELETE api/movie
// @desc Delete a movie
// @access Public
router.delete('/:id', passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        Movie.findById(req.params.id)
        .then(movie => movie.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
    }
);

/*
// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
    }
  );
  */

module.exports = router;