const express = require('express');
const router = express.Router();

// @route GET api/users/
// @desc Get all 
// @access Public
/*
router.get('/', (req, res) => {
    MovieNight.find()
        .sort({ date: -1 })  //descending
        .then(movieNights => res.json(movieNights))
});
*/

// @route GET api/users/test
// @desc Tests posts route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Users Works"})
);

module.exports = router;