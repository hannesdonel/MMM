const xss = require('xss');
const Models = require('../models');

const { Directors } = Models;

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

module.exports = DirectorsServices;
