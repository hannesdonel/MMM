import xss from 'xss';
import { Movies } from '../models.js';

/** These services are browsing the database for a specific request on movies and return
 * one movie or an array of movies. A movie is an object:
 *
 * @property {string} _id - Automatically generated user ID.
 * @property {string} title - Movie title
 * @property {string} description - Description of movie
 * @property {array} director - Array of objects - each director of a movie is an object
 * @property {string} director.name - Name of director
 * @property {string} director.bio - Biography of director
 * @property {string} director.birth_year - Birth year of director
 * @property {string} director.death_year - Death year of director
 * @property {array} actors - Array of strings - a string for each actor of a movie
 * @property {array} genre - Array of objects - each genre of a movie is an object
 * @property {string} genre.name - Name of genre
 * @property {string} genre.description - Description of genre
 * @property {string} imageUrl - URL to movie poster
 * @property {boolean} featured - Set if movie is featured or not
*/
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
export default MoviesServices;
