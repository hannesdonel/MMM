import express from 'express';
import passport from 'passport';
import MoviesServices from './movies-services.js';

const MoviesRouter = express.Router();

/**
 * These routes are connecting an API call with the matching CRUD action on the database
 * in the movies collection.
 *
 * @module MoviesRouter
 */
MoviesRouter
// Get movie by title
  .get('/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const result = await MoviesServices.get_movie_by_title(req);
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
    try {
      const result = await MoviesServices.get_movies_by_genre_actor(req);
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

export default MoviesRouter;
