require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
const allowedOrigins = ['http://localhost:8080', 'https://more-movie-metadata.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
})); const morgan = require('morgan');
const mongoose = require('mongoose');

app.use(morgan('common'));

const config = require('./config');

const { CONNECTION_URI } = config;
mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const MoviesRouter = require('./movies/movies-router');
const GenresRouter = require('./genres/genres-router');
const DirectorsRouter = require('./directors/directors-router');
const UsersRouter = require('./users/users-router');
require('./passport');
/* eslint-disable-next-line */
const auth = require('./auth')(app);

// GENERAL ROUTING

// Routing for root
app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/index.html`);
});

// Make /public directory available
app.use('/public', express.static('public'));

// Routing for documentation
app.get('/documentation', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/documentation.html`);
});

// MOVIES

app.use('/movies', MoviesRouter);

// GENRES

app.use('/genres', GenresRouter);

// DIRECTORS

app.use('/directors', DirectorsRouter);

// USERS SECTION

app.use('/users', UsersRouter);

// Error handler
app.use((err, req, res, next) => {
  /* eslint-disable-next-line */
  console.error(err.stack);
  res.status(500).send('Ups, something went wrong. Please try again.');
});

const { PORT } = config;
app.listen(PORT, '0.0.0.0', () => {
  /* eslint-disable-next-line */
  console.log(`Server is listening on port ${PORT || 8080}.`);
});
