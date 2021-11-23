import xss from 'xss';
import { Movies, Users } from '../models.js';

/**
 * These services are browsing the database for a specific request on users.
 *
 * User object has the following structure:
 * @property {string} user_name - The user's username
 * @property  {string} password - The user's password
 * @property {string} email - The user's mail adress
 * @property {string} birth_date - The user's birth date.
*/
const UsersServices = {
  // User registration
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
  // Get information about a user by ID.
  get_user_information: async (req) => {
    try {
      const user = await Users.findOne({ _id: req.params._id }).populate('favorites').populate({
        path: 'favorites',
        populate: {
          path: 'director',
        },
      }).populate({
        path: 'favorites',
        populate: {
          path: 'genre',
        },
      });
      if (!user) {
        return { success: false, statusCode: 404, message: `User ${xss(req.params.user_name)} doesn't exist.` };
      }
      return { success: true, user: Users.serialize(user) };
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
  // Change user data by ID
  put_user_information: async (req) => {
    try {
      const anotherUser = await Users.findOne({ user_name: req.body.user_name });
      const user = await Users.findOne({ _id: req.params._id });
      if (anotherUser && req.params._id != anotherUser._id) {
        return { success: false, statusCode: 404, message: `${req.body.user_name} already exists. Please choose another username.` };
      }
      if (user) {
        const updateObject = {};

        if (req.body.user_name) {
          updateObject.user_name = req.body.user_name;
        }
        if (req.body.password) {
          const hashedPassword = Users.hashPassword(req.body.password);
          updateObject.password = hashedPassword;
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
        } return { sucess: false, statusCode: 500, error: 'Something went wrong. Please contact admin.' };
      }
      if (!user) {
        return { sucess: false, statusCode: 404, message: `User ${req.params._id} doesn't exist.` };
      }
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
  // Add movie to favorites
  put_favorites: async (req) => {
    try {
      const movie = await Movies.findOne({ _id: req.params.movieID });
      if (!movie) {
        return { success: false, statusCode: 404, message: `Movie with ID ${req.params.movieID} doesn't exist.` };
      }
      await Users.findOneAndUpdate(
        {
          _id: req.params._id,
        }, {
          $addToSet: { favorites: req.params.movieID },
        },
        { new: true },
      );
      return { success: true, message: `Movie ${req.params.movieID} has been successfully added to your favorites.` };
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
  // Remove movie from favorites
  delete_favorites: async (req) => {
    try {
      const movie = await Movies.findOne({ _id: req.params.movieID });
      if (!movie) {
        return { success: false, statusCode: 404, message: `Movie with ID ${req.params.movieID} doesn't exist.` };
      }
      await Users.findOneAndUpdate(
        {
          _id: req.params._id,
        }, {
          $pull: { favorites: req.params.movieID },
        },
        { new: true },
      );
      return { success: true, message: `Movie ${req.params.movieID} has been successfully deleted from your favorites.` };
    } catch (error) {
      return { sucess: false, statusCode: 500, error };
    }
  },
};

export default UsersServices;
