import xss from 'xss';
import { Directors } from '../models.js';

/**
 * These services are browsing the database for a specific request on directors and return
 * one director or an array of director. A director is an object:
 *
 * @property {string} name - Name of director
 * @property {string} bio - Biography of director
 * @property {string} birth_year - Birth year of director
 * @property {string} death_year - Death year of director */
const DirectorsServices = {
  // Get all directors
  get_all_directors: async () => {
    try {
      const directors = await Directors.find({});
      return { success: true, directors };
    } catch (error) {
      return { success: false, statusCode: 500, error };
    }
  },
  // Get director by name
  get_directors_by_name: async (req) => {
    try {
      const director = await Directors.find({ name: req.params.name });
      if (director.length === 0) {
        return { success: false, statusCode: 404, message: `Sorry, I couldn't find a director named ${xss(req.params.name)}.` };
      }
      return { success: true, director };
    } catch (error) {
      return { success: false, statusCode: 500, error };
    }
  },
};

export default DirectorsServices;
