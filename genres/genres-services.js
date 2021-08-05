const xss = require('xss');
const Models = require('../models');

const { Genres } = Models;

exports.get_all_genres = async (req, res) => {
  try {
    const genres = await Genres.find({});
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

exports.get_genre_by_name = async (req, res) => {
  try {
    const genre = await Genres.find({ name: xss(req.params.name) });
    if (genre.length === 0) {
      res.status(404).send(`Sorry, I couldn't find a genre named ${xss(req.params.name)}.`);
    } else {
      res.status(200).json(genre);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};
