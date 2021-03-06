import xss from 'xss';
import { Genres } from '../models.js';

/** These services are browsing the database for a specific request on genres and return
 * one genre or an array of genres. A genre is an object:
 *
 * @property {string} name - Name of genre
 * @property {string} description - Description of genre
*/
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

export default GenresServices;
