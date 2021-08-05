const xss = require('xss');
const Models = require('../models');

const { Directors } = Models;

exports.get_all_directors = async (req, res) => {
  try {
    const directors = await Directors.find({});
    res.status(200).json(directors);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

exports.get_directors_by_name = async (req, res) => {
  try {
    const director = await Directors.find({ name: xss(req.params.name) });
    if (director.length === 0) {
      res.status(404).send(`Sorry, I couldn't find a genre named ${xss(req.params.name)}.`);
    } else {
      res.status(200).json(director);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};
