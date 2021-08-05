const express = require('express');
const passport = require('passport');

const GenresRouter = express.Router();
const GenresServices = require('./genres-services');

GenresRouter
// Get all genres
  .get('/', passport.authenticate('jwt', { session: false }), GenresServices.get_all_genres)
// Get genre by name
  .get('/:name', passport.authenticate('jwt', { session: false }), GenresServices.get_genre_by_name);

module.exports = GenresRouter;
