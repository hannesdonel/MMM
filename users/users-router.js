const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

const UsersRouter = express.Router();
const UsersServices = require('./users-services');

UsersRouter
  // User registration
  .post('/', [
    check('user_name', 'Username with at least three characters is required.')
      .isLength({ min: 3 }),
    check('user_name', 'Only alphanumeric caracters allowed.')
      .isAlphanumeric(),
    check('password', 'Password musn\'t be empty!')
      .not().isEmpty(),
    check('email', 'Please enter a valid mail adress.')
      .isEmail(),
    check('birth_date', 'Please enter a birthday in this format: YYYY-DD-MM')
      .isDate(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send(errors);
    }
    const result = await UsersServices.post_new_user(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
  // User deregistration by ID
  .delete('/:_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await UsersServices.delete_user(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
  // Get information about a user by ID.
  .get('/:_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await UsersServices.get_user_information(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
  // Change user data (one at a time) by ID
  /* We’ll expect JSON in this format
  {
    user_name: String,(required)
    password: String,(required)
    email: String,(required)
    birth_date: Date
  } */
  .put('/:_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await UsersServices.put_user_information(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
  // Add movie to favorites
  .put('/:_id/favorites/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await UsersServices.put_favorites(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  })
  // Remove movie from favorites
  .delete('/:_id/favorites/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const result = await UsersServices.delete_favorites(req);
    try {
      if (!result.success && result.statusCode === 404) {
        res.status(404).send(result.message);
      } else if (!result.success && result.statusCode === 500) {
        res.status(500).send(result.error);
      } else {
        res.status(201).send(result);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = UsersRouter;
