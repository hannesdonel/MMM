import express from 'express';
import passport from 'passport';
import GenresServices from './genres-services.js';

const GenresRouter = express.Router();

/**
 * These routes are connecting an API call with the matching CRUD action on the database
 * in the genres collection.
 *
 * @module GenresRouter
 */
GenresRouter
// Get all genres
  .get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const result = await GenresServices.get_all_genres();
      if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(200).send(result.genres);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
// Get genre by name
  .get('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const result = await GenresServices.get_genre_by_name(req);
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(200).send(result.genre);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

export default GenresRouter;
