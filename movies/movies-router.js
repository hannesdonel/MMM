const express = require('express');
const passport = require('passport');

const MoviesRouter = express.Router();
const MoviesServices = require('./movies-services');

MoviesRouter
// Get movie by title
  .get('/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await MoviesServices.get_movie_by_title(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(200).send(result.movie);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
// Get all movies and movies by genre and/or actor
  .get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await MoviesServices.get_movies_by_genre_actor(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(200).send(result.movies);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = MoviesRouter;
