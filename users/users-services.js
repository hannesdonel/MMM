const xss = require('xss');

const Models = require('../models');

const { Users } = Models;

const UsersServices = {
  /* User registration

  We'll expect JSON in this format:
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }  birth_date: Date,
  */
  post_new_user: async (req) => {
    try {
      const user = await Users.findOne({ user_name: req.body.user_name });
      if (user && Object.keys(req.body).length > 0) {
        return { success: false, statusCode: 404, message: `${req.body.user_name} already exists. Please choose another username.` };
      }
      const hashedPassword = Users.hashPassword(req.body.password);
      try {
        const newUser = await Users.create({
          user_name: req.body.user_name,
          password: hashedPassword,
          email: req.body.email,
          birth_date: req.body.birth_date,
        });
        return { success: true, message: `You are now registered as:<br>${JSON.stringify(Users.serialize(newUser))}` };
      } catch (error) {
        return { sucess: false, statusCode: 500, error };
      }
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
  // User deregistration by ID
  delete_user: async (req) => {
    try {
      const user = await Users.findOneAndRemove({ _id: req.params._id });
      if (!user) {
        return { success: false, statusCode: 404, message: `There's no user with ID ${xss(req.params._id)}.` };
      }
      return { success: true, message: `User ${xss(req.params._id)} successfully deleted.` };
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
  // Get information about a user by name.
  get_user_information: async (req) => {
    try {
      const user = await Users.findOne({ user_name: req.params.user_name });
      if (!user) {
        return { success: false, statusCode: 404, message: `User ${xss(req.params.user_name)} doesn't exist.` };
      }
      return { success: true, user: Users.serialize(user) };
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
  // Change user data (one at a time) by ID
  /* We’ll expect JSON in this format
  {
    user_name: String,(required)
    password: String,(required)
    email: String,(required)
    birth_date: Date
  } */
  put_user_information: async (req) => {
    try {
      const updateObject = {};

      if (req.body.user_name) {
        updateObject.user_name = req.body.user_name;
      }
      if (req.body.password) {
        const hashedPassword = Users.hashPassword(req.body.password);
        updateObject.user_name = hashedPassword;
      }
      if (req.body.email) {
        updateObject.email = req.body.email;
      }
      if (req.body.birth_date) {
        updateObject.birth_date = req.body.birth_date;
      }

      const updatedUser = await Users.findOneAndUpdate({ _id: req.params._id }, {
        $set: updateObject,
      },
      { new: true });
      if (updatedUser) {
        return { success: true, message: `User data successfully changed:<br>${JSON.stringify(Users.serialize(updatedUser))}` };
      }
      return { sucess: false, statusCode: 404, message: `User ${req.params._id} doesn't exist.` };
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
  // Add movie to favorites
  post_favorites: (req) => {
    Users.findOneAndUpdate({ user_name: req.params.user_name }, {
      $addToSet: { favorites: req.params.movieID },
    },
    { new: true },
    (err) => {
      if (err) {
        return { success: false, statusCode: 404, message: `Movie with ID ${req.params.movieID} doesn't exist.` };
      }
      return { success: true, message: `Movie ${req.params.movieID} has been successfully added to your favorites.` };
    });
  },
  // Remove movie from favorites
  delete_favorites: async (req) => {
    await Users.findOneAndUpdate({ user_name: req.params.user_name }, {
      $pull: { favorites: req.params.movieID },
    },
    { new: true },
    (err) => {
      if (err) {
        return { success: false, statusCode: 404, message: `Movie with ID ${req.params.movieID} doesn't exist.` };
      }
      return { success: true, message: `Movie ${req.params.movieID} has been successfully deleted from your favorites.` };
    });
  },
};

module.exports = UsersServices;
