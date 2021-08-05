const xss = require('xss');
const Models = require('../models');

const { Movies } = Models;

exports.get_all_movies = async (req, res) => {
  // Get movie by title
  try {
    const movie = await Movies.find({ title: req.params.title }).populate('genre', 'name').populate('director', 'name');
    if (movie.length === 0) {
      res.status(404).send(`There is no movie entitled ${xss(req.params.title)}`);
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

exports.get_movies_by_genre_actor = async (req, res) => {
  // Get movies by genre & actor
  const genreQuery = xss(req.query.genre);
  const actorQuery = xss(req.query.actor);
  if (genreQuery && actorQuery) {
    try {
      const movies = await Movies.find({ genre: genreQuery, actors: actorQuery }).populate('genre', 'name').populate('director', 'name');
      if (movies.length === 0) {
        res.status(404).send(`Found no movie with genre ${genreQuery} starring ${actorQuery}.`);
      } else {
        res.status(200).json(movies);
      }
    } catch (error) {
      res.status(500).send(`Error: ${error}`);
    }
    // Get movies by actor
  } else if (actorQuery) {
    try {
      const movies = await Movies.find({ actors: actorQuery }).populate('genre', 'name').populate('directors', 'name');
      if (movies.length === 0) {
        res.status(404).send(`Found no movie starring ${actorQuery}.`);
      } else {
        res.status(201).json(movies);
      }
    } catch (error) {
      res.status(500).send(`Error: ${error}`);
    }
    // Get movies by genre ID
  } else if (genreQuery) {
    try {
      const movies = await Movies.find({ genre: genreQuery }).populate('genre', 'name').populate('director', 'name');
      if (movies.length === 0) {
        res.status(404).send(`Found no movie with genre ${genreQuery}.`);
      } else {
        res.status(200).json(movies);
      }
    } catch (error) {
      res.status(500).send(`Error: ${error}`);
    }
  } else {
    // Get all movies
    try {
      const movies = await Movies.find({}).populate('genre', 'name').populate('director', 'name');
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).send(`Error: ${error}`);
    }
  }
};
