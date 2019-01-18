const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const movieNights = require('./routes/api/movieNights');
const movies = require('./routes/api/movies');

const app = express();

// Bodyparser Middlewear
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/movieNights', movieNights);
app.use('/api/movies', movies);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));