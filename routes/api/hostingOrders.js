const express = require('express');
const router = express.Router();
//const passport = require('passport');

// Load validation
//const validateMovieInput = require('../../validation/movie');

// HostingOrder model
const HostingOrder = require('../../models/HostingOrder');

// @route GET api/hostingOrders
// @desc Get all hostingOrders
// @access Public
router.get('/', (req, res) => {
    HostingOrder.find()
        //.sort({ order: -1 })  //descending
        .then(hostingOrders => res.json(hostingOrders))
});

// @route   GET api/hostingOrders/all
// @desc    Get all hostingOrders
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};
    
    HostingOrder.find()
      .then(hostingOrders => {
        if (!hostingOrders) {
          errors.noHostingOrder = 'There are no hostingOrders';
          return res.status(404).json(errors);
        }
  
        res.json(hostingOrders);
      })
      .catch(err => res.status(404).json({ hostingOrders: 'There are no hostingOrders' }));
  });

module.exports = router;