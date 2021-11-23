import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import xss from 'xss';

/**
 * Definition of schemata for communication with database.
 *
 * @module Schemata
 */

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  director: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }],
  actors: [String],
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  image_url: String,
  featured: Boolean,
});

const genreSchema = mongoose.Schema({
  name: String,
  description: String,
});

const directorSchema = mongoose.Schema({
  name: String,
  bio: String,
  birth_year: String,
  seath_year: String,
});

const userSchema = mongoose.Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birth_date: Date,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/** Password hashing. */
userSchema.statics.hashPassword = (password) => bcrypt.hashSync(password, 10);

/** Hashed password comparison. */
/* eslint-disable-next-line */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/** Serializing username and email to prevent xss attacks. */
userSchema.statics.serialize = (user) => ({
  _id: user._id,
  user_name: xss(user.user_name),
  email: xss(user.email),
  birth_date: user.birth_date,
  favorites: user.favorites,
});

const Movies = mongoose.model('Movie', movieSchema);
const Genres = mongoose.model('Genre', genreSchema);
const Directors = mongoose.model('Director', directorSchema);
const Users = mongoose.model('User', userSchema);

export {
  Movies, Genres, Directors, Users,
};
