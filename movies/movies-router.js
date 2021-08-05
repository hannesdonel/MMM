const express = require('express');
const passport = require('passport');

const MoviesRouter = express.Router();
const MoviesServices = require('./movies-services');

MoviesRouter
  .get('/', passport.authenticate('jwt', { session: false }), MoviesServices.get_movies_by_genre_actor)
  .get('/:title', passport.authenticate('jwt', { session: false }), MoviesServices.get_all_movies);

module.exports = MoviesRouter;
