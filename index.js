import 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

import { CONNECTION_URI, PORT } from './config.js';
import './passport.js';
import MoviesRouter from './movies/movies-router.js';
import GenresRouter from './genres/genres-router.js';
import DirectorsRouter from './directors/directors-router.js';
import UsersRouter from './users/users-router.js';

const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://more-movie-metadata.netlify.app', 'https://hannesdonel.github.io'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
}));

app.use(morgan('common'));

// Connect to database
mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

/* eslint-disable-next-line */
import Login from './auth.js';
/* eslint-disable-next-line */
const auth = Login(app);

/** @module Routing */

/**
 * Routing for root
 *
 * @param {string} enpoint root of application.
 */
app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/index.html`);
});

/** Make /public directory available */
app.use('/public', express.static('public'));
/** Make /doc directory available */
app.use('/doc', express.static('doc'));

/** Routing for documentation */
app.get('/documentation', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/documentation.html`);
});
app.get('/doc', (req, res) => {
  res.status(200).sendFile(`${__dirname}/doc/index.html`);
})

/** MOVIES */
app.use('/movies', MoviesRouter);

/** GENRES */
app.use('/genres', GenresRouter);

/** DIRECTORS */
app.use('/directors', DirectorsRouter);

/** USERS SECTION */
app.use('/users', UsersRouter);

/** Error handler */
app.use((err, req, res, next) => {
  /* eslint-disable-next-line */
  console.error(err.stack);
  res.status(500).send('Ups, something went wrong. Please try again.');
});

/** Definition of development server. */
app.listen(PORT, '0.0.0.0', () => {
  /* eslint-disable-next-line */
  console.log(`Server is listening on port ${PORT || 8080}.`);
});
