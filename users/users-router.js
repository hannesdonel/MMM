const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');

const UsersRouter = express.Router();
const UsersServices = require('./users-services');

UsersRouter
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
  ], UsersServices.post_new_user)
  .delete('/:_id', passport.authenticate('jwt', { session: false }), UsersServices.delete_user)
  .get('/:user_name', passport.authenticate('jwt', { session: false }), UsersServices.get_user_information)
  .put('/:_id', [
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
  ], passport.authenticate('jwt', { session: false }), UsersServices.put_user_information)
  .post('/:user_name/favorites/:movieID', passport.authenticate('jwt', { session: false }), UsersServices.post_favorites)
  .delete('/:user_name/favorites/:movieID', passport.authenticate('jwt', { session: false }), UsersServices.delete_favorites);

module.exports = UsersRouter;
