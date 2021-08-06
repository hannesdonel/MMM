const xss = require('xss');
const Models = require('../models');

const { Genres } = Models;

const GenresServices = {
  // Get all genres
  get_all_genres: async () => {
    try {
      const genres = await Genres.find({});
      return { success: true, genres };
    } catch (error) {
      return { success: false, statusCode: 500, error };
    }
  },
  // Get genre by name
  get_genre_by_name: async (req) => {
    try {
      const genre = await Genres.find({ name: req.params.name });
      if (genre.length === 0) {
        return { success: false, statusCode: 404, message: `Sorry, I couldn't find a genre named ${xss(req.params.name)}.` };
      }
      return { success: true, genre };
    } catch (error) {
      return { success: false, statusCode: 500, error };
    }
  },
};

module.exports = GenresServices;
