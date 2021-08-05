const { validationResult } = require('express-validator');
const xss = require('xss');

const Models = require('../models');

const { Users } = Models;

/* User registration

We'll expect JSON in this format:
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true }  birth_date: Date,
*/
exports.post_new_user = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const user = await Users.findOne({ user_name: xss(req.body.user_name) });
    if (user && Object.keys(req.body).length > 0) {
      res.status(400).send(`${req.body.user_name} already exists. Please choose another username.`);
    } else {
      const hashedPassword = Users.hashPassword(xss(req.body.password));
      Users
        .create({
          user_name: xss(req.body.user_name),
          password: hashedPassword,
          email: xss(req.body.email),
          birth_date: xss(req.body.birth_date),
        })
        .then((newUser) => { res.status(201).send(`You are now registered as:<br>${JSON.stringify(Users.serialize(newUser))}`); })
        .catch((error) => res.status(500).send(`Error: ${error}`));
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

// User deregistration by ID
exports.delete_user = async (req, res) => {
  try {
    const user = await Users.findOneAndRemove({ _id: xss(req.params._id) });
    if (!user) {
      res.status(404).send(`There's no user with ID ${xss(req.params._id)}.`);
    } else {
      res.status(201).send(`User ${xss(req.params._id)} successfully deleted.`);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

// Get information about a user by name.
exports.get_user_information = async (req, res) => {
  try {
    const user = await Users.findOne({ user_name: xss(req.params.user_name) });
    if (!user) {
      res.status(404).send(`User ${xss(req.params.user_name)} doesn't exist.`);
    } else {
      res.status(200).json(Users.serialize(user));
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

// Change user data (one at a time) by ID
/* We’ll expect JSON in this format
{
  user_name: String,(required)
  password: String,(required)
  email: String,(required)
  birth_date: Date
} */
exports.put_user_information = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const updateObject = {};

    if (req.body.user_name) {
      updateObject.user_name = xss(req.body.user_name);
    }
    if (req.body.password) {
      const hashedPassword = Users.hashPassword(req.body.password);
      updateObject.user_name = hashedPassword;
    }
    if (req.body.email) {
      updateObject.email = xss(req.body.email);
    }
    if (req.body.birth_date) {
      updateObject.birth_date = xss(req.body.birth_date);
    }

    const updatedUser = await Users.findOneAndUpdate({ _id: xss(req.params._id) }, {
      $set: updateObject,
    },
    { new: true });
    if (updatedUser) {
      res.status(201).json(Users.serialize(updatedUser));
    } else {
      res.status(500).send('Something went wrong, try again.');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

// Add movie to favorites
exports.post_favorites = (req, res) => {
  Users.findOneAndUpdate({ user_name: xss(req.params.user_name) }, {
    $addToSet: { favorites: xss(req.params.movieID) },
  },
  { new: true },
  (err) => {
    if (err) {
      res.status(404).send(`Movie with ID ${xss(req.params.movieID)} doesn't exist.`);
    } else {
      res.status(201).send(`Movie ${xss(req.params.movieID)} has been successfully added to your favorites.`);
    }
  });
};

// Remove movie from favorites
exports.delete_favorites = (req, res) => {
  Users.findOneAndUpdate({ user_name: xss(req.params.user_name) }, {
    $pull: { favorites: xss(req.params.movieID) },
  },
  { new: true },
  (err) => {
    if (err) {
      res.status(404).send(`Movie with ID ${xss(req.params.movieID)} doesn't exist.`);
    } else {
      res.status(201).send(`Movie ${xss(req.params.movieID)} has been successfully removed from your favorites.`);
    }
  });
};
