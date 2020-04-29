const express = require('express');
const router = express.Router();
const passport = require('passport');

// ReleaseNote model
const ReleaseNote = require('../../models/ReleaseNote');

// Load validation
const validateReleaseNoteInput = require('../../validation/releaseNote');

// @route GET api/releaseNotes
// @desc Get all releaseNotes
// @access Public
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    ReleaseNote.find()
        .sort({ date: -1 })  // descending
        .then(releaseNote => res.json(releaseNote))
});

// @route   GET api/releaseNote/date/:date
// @desc    Get releaseNote by date
// @access  Public
router.get('/date/:date', (req, res) => {
    const errors = {};
    
    ReleaseNote.findOne({ date: req.params.date })
      .then(releaseNote => {
        if (!releaseNote) {
            errors.releaseNote = 'There is no release notes with this date: ' + req.params.date;
            res.status(404).json(errors);
        }
  
        res.json(releaseNote);
      })
      .catch(err => res.status(404).json(err));
  });


module.exports = router;