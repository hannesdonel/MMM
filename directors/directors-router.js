const express = require('express');
const passport = require('passport');

const DirectorsRouter = express.Router();
const DirectorsServices = require('./directors-services');

DirectorsRouter
// Get all directors
  .get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await DirectorsServices.get_all_directors();
    try {
      if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(200).send(result.directors);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
// Get director by name
  .get('/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await DirectorsServices.get_directors_by_name(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(200).send(result.director);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = DirectorsRouter;
