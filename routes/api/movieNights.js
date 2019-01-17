const express = require('express');
const router = express.Router();

// MovieNight model
const MovieNight = require('../../models/MovieNight');

// @route GET api/movieNight
// @desc Get all movieNights
// @access Public
router.get('/', (req, res) => {
    MovieNight.find()
        .sort({ date: -1 })  //descending
        .then(movieNights => res.json(movieNights))
});

// @route POST api/movieNights
// @desc Create a movieNight
// @access Public
router.post('/', (req, res) => {
    const newMovieNight = new MovieNight({
        host: req.body.host,
        location: req.body.location,
        movieViewed: req.body.movieViewed
    });

    newMovieNight.save().then(movieNight => res.json(movieNight));
});

// @route DELETE api/movieNight
// @desc Delete a movieNight
// @access Public
router.delete('/:id', (req, res) => {
    MovieNight.findById(req.params.id)
    .then(movieNight => movieNight.remove().then(() => res.json({success: true})))
    .catch(err => res.status(404).json({success: false}));
});
module.exports = router;