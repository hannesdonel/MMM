const xss = require('xss');
const Models = require('../models');

const { Movies } = Models;

/** These services are browsing the database for a specific request on movies. */
const MoviesServices = {
  // Get movie by title
  get_movie_by_title: async (req) => {
    try {
      const movie = await Movies.find({ title: req.params.title }).populate('genre', 'name').populate('director', 'name');
      if (movie.length === 0) {
        return { success: false, statusCode: 404, message: `There is no movie entitled ${xss(req.params.title)}` };
      } return { success: true, movie };
    } catch (error) {
      return { success: false, statusCode: 500, error };
    }
  },
  get_movies_by_genre_actor: async (req) => {
  // Get movies by genre ID & actor
    const genreQuery = xss(req.query.genre);
    const actorQuery = xss(req.query.actor);
    if (genreQuery && actorQuery) {
      try {
        const movies = await Movies.find({ genre: genreQuery, actors: actorQuery }).populate('genre', 'name').populate('director', 'name');
        if (movies.length === 0) {
          return { success: false, statusCode: 404, message: `Found no movie with genre ${genreQuery} starring ${actorQuery}.` };
        }
        return { success: true, movies };
      } catch (error) {
        return { success: false, statusCode: 500, error };
      }
    // Get movies by actor
    } else if (actorQuery) {
      try {
        const movies = await Movies.find({ actors: actorQuery }).populate('genre', 'name').populate('directors', 'name');
        if (movies.length === 0) {
          return { success: false, statusCode: 404, message: `Found no movie starring ${actorQuery}.` };
        }
        return { success: true, movies };
      } catch (error) {
        return { success: false, statusCode: 500, error };
      }
    // Get movies by genre ID
    } else if (genreQuery) {
      try {
        const movies = await Movies.find({ genre: genreQuery }).populate('genre', 'name').populate('director', 'name');
        if (movies.length === 0) {
          return { success: false, statusCode: 404, message: `Found no movie with genre ${genreQuery}.` };
        }
        return { success: true, movies };
      } catch (error) {
        return { success: false, statusCode: 500, error };
      }
    } else {
    // Get all movies
      try {
        const movies = await Movies.find({}).populate('genre', 'name').populate('director', 'name');
        return { success: true, movies };
      } catch (error) {
        return { success: false, statusCode: 500, error };
      }
    }
  },
};

module.exports = MoviesServices;
