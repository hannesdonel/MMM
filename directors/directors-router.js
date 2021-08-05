const express = require('express');
const passport = require('passport');

const DirectorsRouter = express.Router();
const DirectorsServices = require('./directors-services');

DirectorsRouter
// Get all directors
  .get('/', passport.authenticate('jwt', { session: false }), DirectorsServices.get_all_directors)
// Get director by name
  .get('/:name', passport.authenticate('jwt', { session: false }), DirectorsServices.get_directors_by_name);

module.exports = DirectorsRouter;
