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

// @route   GET api/movie/imdbId/:imdbId
// @desc    Get movie by imdbId
// @access  Public
router.get('/imdbId/:imdbId', (req, res) => {
  const errors = {};
  Movie.findOne({ imdbId: req.params.imdbId })
    .then(movie => {
      if (!movie) {
        errors.nomovie = 'There is no movie with this imdbId: ' + req.params.imdbId;
        res.status(404).json(errors);
      }

      res.json(movie);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/movie/genre/:genre
// @desc    Get movies by genre
// @access  Public
router.get('/genre/:genre', (req, res) => {
  const errors = {};
  Movie.find({ 'genres.name': req.params.genre })
      //.sort({ genre: -1 })  // descending
      .sort({ releaseDate: -1 })  //descending
      .then(movies => {
          if (!movies) {
              errors.nomovies = 'There are no movies with genre: ' + req.params.genre;
              res.status(404).json(errors);
          }
          //console.log(movies);
          res.json(movies);
      })
      .catch(err => res.status(404).json(err));
});

// @route   GET api/movie/person/:personTmdbId
// @desc    Get movies by person (cast and crew)
// @access  Public
router.get('/person/:personTmdbId', (req, res) => {
  const errors = {};
  var movies = [];
  var distinctMovies;
  Movie.find({ 'cast': req.params.personTmdbId })
      .sort({ releaseDate: -1 })  //descending
      .then(castMovies => {
          Movie.find({ 'crew': req.params.personTmdbId })
              .sort({ releaseDate: -1 })  //descending
              .then(crewMovies => {
                  if (castMovies) {
                      // there are movies that match for both cast and crew  
                      movies.push(castMovies);
                      const result = movies.concat(crewMovies) // [{a: 1}, {b: 2}, {a: 1}]
                      distinctMovies = [...new Set(result.map(movie => movie.imdbId))]
                  } else {
                      if (crewMovies) {
                          // there are only movies that match to crew
                          distinctMovies.push(crewMovies)
                      }
                  }
                  if (!movies) {
                      errors.nomovies = 'There are no movies with person: ' + req.params.personTmdbId;
                      res.status(404).json(errors);
                  }
                  //console.log(movies);
                  res.json(movies);
              })
          
      })
      .catch(err => res.status(404).json(err));
});

// @route   GET api/movie/castMember/:personTmdbId
// @desc    Get movies by castMember
// @access  Public
router.get('/castMember/:personTmdbId', (req, res) => {
  const errors = {};
  Movie.find({ 'cast': req.params.personTmdbId })
      //.sort({ genre: -1 })  // descending
      .sort({ releaseDate: -1 })  //descending
      .then(movies => {
          if (!movies) {
              errors.nomovies = 'There are no movies with castMember: ' + req.params.personTmdbId;
              res.status(404).json(errors);
          }
          //console.log(movies);
          res.json(movies);
      })
      .catch(err => res.status(404).json(err));
});

// @route   GET api/movie/crewMember/:personTmdbId
// @desc    Get movies by crewMember
// @access  Public
router.get('/crewMember/:personTmdbId', (req, res) => {
  const errors = {};
  Movie.find({ 'crew': req.params.personTmdbId })
      //.sort({ genre: -1 })  // descending
      .sort({ releaseDate: -1 })  //descending
      .then(movies => {
          if (!movies) {
              errors.nomovies = 'There are no movies with crewMember: ' + req.params.personTmdbId;
              res.status(404).json(errors);
          }
          //console.log(movies);
          res.json(movies);
      })
      .catch(err => res.status(404).json(err));
});

// @route POST api/movies
// @desc Create a movie
// @access Private
router.post(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        const { errors, isValid } = validateMovieInput(req.body);
        console.log(req.body);
        //console.log("errors: " + errors);

        // check validation
        //if(!isValid) {
            // return any errors with 400 status
        //    console.log(errors);
        //    return res.status(400).json(errors);
        //}
        const movieFields = {};
        
        //movieFields.user = req.user.id;
        if(req.body.title) movieFields.title = req.body.title;
        if(req.body.releaseDate) movieFields.releaseDate = req.body.releaseDate;
        if(req.body.imdbId) movieFields.imdbId = req.body.imdbId;
        if(req.body.tmdbId) movieFields.tmdbId = req.body.tmdbId;
        if(req.body.genres) movieFields.genres = req.body.genres;
        if(req.body.cast) movieFields.cast = req.body.cast;
        if(req.body.crew) movieFields.crew = req.body.crew;

        Movie.findOne({ title: req.body.title })
            .then(movie => {
                if(movie) {
                  console.log("Found movie: " + movie.imdbId);
                    // update
                    Movie.findOneAndUpdate(
                        { imdbId: req.body.imdbId },
                        { $set: movieFields }, 
                        { new: true }
                    )
                    .then(movie => res.json(movie));
                    //movie.save();
                } else { // create
                    // check if title exists
                    Movie.findOne({ imdbId: req.body.imdbId })
                        .then(movie => {
                            if(movie) {
                                errors.handle = 'A movie with that IMDB ID already exists';
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