const express = require('express');
const router = express.Router();

// Load User model
const User = require('../../models/User');

// @route GET api/userDetails
// @desc Get all userDetails (that are hosts)
// @access Public
router.get('/', (req, res) => {
    // excludes users in db that are not hosts
    User.where('hostingOrder').ne(null)
        //.sort({ order: -1 })  //descending
        .then(userDetails => res.json(userDetails))
});

module.exports = router;