const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const movieNights = require('./routes/api/movieNights');
const movies = require('./routes/api/movies');
const users = require('./routes/api/users');
const userDetails = require('./routes/api/userDetails');
const hostingOrders = require('./routes/api/hostingOrders');
const releaseNotes = require('./routes/api/releaseNotes');


const app = express();

app.use(express.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/movieNights', movieNights);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/userDetails', userDetails);
app.use('/api/hostingOrders', hostingOrders);
app.use('/api/releaseNotes', releaseNotes);

// Serve static assets in Producion
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));