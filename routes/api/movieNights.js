const express = require('express');
const router = express.Router();
const passport = require('passport');

// MovieNight model
const MovieNight = require('../../models/MovieNight');

const validateMovieNightInput = require('../../validation/movieNight');

// @route GET api/movieNight
// @desc Get all movieNights
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    MovieNight.find()
        .sort({ date: -1 })  // descending
        .then(movieNights => res.json(movieNights))
});

// @route   GET api/movieNight/host/:host
// @desc    Get movieNights by host
// @access  Public
router.get('/host/:host', (req, res) => {
    const errors = {};
    MovieNight.find({ host: req.params.host })
        .sort({ date: -1 })  // descending
        .then(movieNights => {
            if (!movieNights) {
                errors.nomovienights = 'There are no movie nights with host: ' + req.params.host;
                res.status(404).json(errors);
            }
    
            res.json(movieNights);
        })
        .catch(err => res.status(404).json(err));
  });

// @route   GET api/movieNight/date/:date
// @desc    Get movieNight by date
// @access  Public
router.get('/date/:date', (req, res) => {
    const errors = {};
    MovieNight.findOne({ date: req.params.date })
      .then(movieNight => {
        if (!movieNight) {
            errors.nomovienight = 'There is no movie night with this date: ' + req.params.date;
            res.status(404).json(errors);
        }
  
        res.json(movieNight);
      })
      .catch(err => res.status(404).json(err));
  });

// @route   GET api/movieNight/movieViewed/:movieViewed
// @desc    Get movieNight by movie viewed IMDB ID
// @access  Public
router.get('/movieViewed/:movieViewed', (req, res) => {
    const errors = {};
    MovieNight.findOne({ movieViewed: req.params.movieViewed })
      .then(movieNight => {
        if (!movieNight) {
            // fail silently and send back null
        }  
        res.json(movieNight);
      })
      .catch(err => res.status(404).json(err));
  });

// @route POST api/movieNight
// @desc Create a movieNight
// @access Private
router.post(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => {
        const { errors, isValid } = validateMovieNightInput(req.body);

        // check validation
        if(!isValid) {
            // return any errors with 400 status
            return res.status(400).json(errors);
        }
        const movieNightFields = {};
        if(req.body.date) movieNightFields.date = req.body.date;
        if(req.body.host) movieNightFields.host = req.body.host;
        if(req.body.location) movieNightFields.location = req.body.location;
        if(req.body.movieViewed) movieNightFields.movieViewed = req.body.movieViewed;
        
        // movieChoicesRoundOne - split into array
        if(typeof req.body.movieChoicesRoundOne !== 'undefined') {
            movieNightFields.movieChoicesRoundOne = req.body.movieChoicesRoundOne; //.split(',');
        }
        // // movieChoicesRoundTwo - split into array
        // if(typeof req.body.movieChoicesRoundTwo !== 'undefined') {
        //     movieNightFields.movieChoicesRoundTwo = req.body.movieChoicesRoundTwo.split(',');
        // }
        // // movieChoicesRoundThree - split into array
        // if(typeof req.body.movieChoicesRoundThree !== 'undefined') {
        //     movieNightFields.movieChoicesRoundThree = req.body.movieChoicesRoundThree.split(',');
        // }

        // movieVotesRoundOne - split into array
        // if(typeof req.body.movieVotesRoundOne !== 'undefined') {
        //     const votesArray = req.body.movieVotesRoundOne.split(',');
        //     votesArray.foreach((vote) => {
        //         const voteObject = {};
        //         voteObject.voter = vote.voter;
        //         voteObject.movie = vote.movie;
        //         movieNightFields.movieVotesRoundOne.add(voteObject);
        //     });
        // }

        MovieNight.findOne({ date: req.body.date })
            .then(movieNight => {
                if(movieNight) {
                    // update
                    Movie.findOneAndUpdate(
                        { date: req.body.date },
                        { $set: movieNightFields }, 
                        { new: true }
                    )
                    .then(movieNight => res.json(movieNight));
                } else { // create
                    // check if date exists
                    MovieNight.findOne({ date: req.body.date })
                        .then(movieNight => {
                            if(movieNight) {
                                errors.handle = 'A movie night with that date already exists';
                                res.status(400).json(errors);
                            }

                            // save MovieNight
                            new MovieNight(movieNightFields).save().then(movieNight => res.json(movieNight));
                        }
                    );
                }
            });
    }
);

// @route DELETE api/movieNight
// @desc Delete a movieNight
// @access Public
router.delete('/:id', (req, res) => {
    MovieNight.findById(req.params.id)
    .then(movieNight => movieNight.remove().then(() => res.json({success: true})))
    .catch(err => res.status(404).json({success: false}));
});


module.exports = router;