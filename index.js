const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MMM', { useNewUrlParser: true, useUnifiedTopology: true });
const cors = require('cors');

app.use(cors());
app.use(morgan('common'));

const { check, validationResult } = require('express-validator');
const passport = require('passport');
const Models = require('./models');
require('./passport');
/* eslint-disable-next-line */
const auth = require('./auth')(app);

const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

// Trusted domain
const allowedOrigins = ['http://localhost:8080', 'https://more-movie-metadata.herokuapp.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    } if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application doesn’t allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
}));

// GENERAL ROUTING SECTION

// Routing for root
app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/index.html`);
});

// Make /public directory available
app.use('/public', express.static('public'));

// Routing for documentation
app.get('/documentation', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/documentation.html`);
});

// MOVIES SECTION

// Get all movies, movies by genreID or/and actor
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const genreQuery = req.query.genre;
  const actorQuery = req.query.actor;
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
    try {
      const movies = await Movies.find({}).populate('genre', 'name').populate('director', 'name');
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).send(`Error: ${error}`);
    }
  }
});

// Get movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.find({ title: req.params.title }).populate('genre', 'name').populate('director', 'name');
    if (movie.length === 0) {
      res.status(404).send(`There is no movie entitled ${req.params.title}`);
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// GENRES SECTION

// Get all genres
app.get('/genres', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const genres = await Genres.find({});
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// Get genre by name
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const genre = await Genres.find({ name: req.params.name });
    if (genre.length === 0) {
      res.status(404).send(`Sorry, I couldn't find a genre named ${req.params.name}.`);
    } else {
      res.status(200).json(genre);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// DIRECTORS SECTION

// Get all directors
app.get('/directors', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const directors = await Directors.find({});
    res.status(200).json(directors);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// Get director by name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const director = await Directors.find({ name: req.params.name });
    if (director.length === 0) {
      res.status(404).send(`Sorry, I couldn't find a genre named ${req.params.name}.`);
    } else {
      res.status(200).json(director);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// USERS SECTION

/* User registration

We'll expect JSON in this format:
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birth_date: Date,
*/
app.post('/users', [
  check('user_name', 'Username with at least three characters is required.')
    .isLength({ min: 3 }),
  check('user_name', 'Only alphanumeric caracters allowed.')
    .isAlphanumeric(),
  check('password', 'Password musn\'t be empty!')
    .not().isEmpty(),
  check('email', 'Please enter a valid mail adress.')
    .isEmail(),
  check('birth_date', 'Please enter a birthday in this format: YYYY-DD-MM')
    .isDate(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const user = await Users.findOne({ user_name: req.body.user_name });
    if (user && Object.keys(req.body).length > 0) {
      res.status(400).send(`${req.body.user_name} already exists. Please choose another username.`);
    } else {
      const hashedPassword = Users.hashPassword(req.body.password);
      Users
        .create({
          user_name: req.body.user_name,
          password: hashedPassword,
          email: req.body.email,
          birth_date: req.body.birth_date,
        })
        .then((newUser) => { res.status(201).send(`You are now registered as:<br>${JSON.stringify(newUser)}`); })
        .catch((error) => res.status(500).send(`Error: ${error}`));
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// User deregistration by ID
app.delete('/users/:_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOneAndRemove({ _id: req.params._id });
    if (!user) {
      res.status(404).send(`There's no user with ID ${req.params._id}.`);
    } else {
      res.status(201).send(`User ${req.params._id} successfully deleted.`);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// Get information about a user by name.
app.get('/users/:user_name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOne({ user_name: req.params.user_name });
    if (!user) {
      res.status(404).send(`User ${req.params.user_name} doesn't exist.`);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// Change user data (one at a time) by ID
/* We’ll expect JSON in this format
{
  user_name: String,(required)
  password: String,(required)
  email: String,(required)
  birth_date: Date
} */
app.put('/users/:_id', [
  check('user_name', 'Username with at least three characters is required.')
    .isLength({ min: 3 }),
  check('user_name', 'Only alphanumeric caracters allowed.')
    .isAlphanumeric(),
  check('password', 'Password musn\'t be empty!')
    .not().isEmpty(),
  check('email', 'Please enter a valid mail adress.')
    .isEmail(),
  check('birth_date', 'Please enter a birthday in this format: YYYY-DD-MM')
    .isDate(),
], passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const updatedUser = await Users.findOneAndUpdate({ _id: req.params._id }, {
      $set:
      {
        user_name: req.body.user_name,
        password: req.body.password,
        email: req.body.email,
        birth_date: req.body.birth_date,
      },
    },
    { new: true });
    if (updatedUser) {
      res.status(201).json(updatedUser);
    } else {
      res.status(500).send('Something went wrong, try again.');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

// Add movie to favorites
app.post('/users/:user_name/favorites/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ user_name: req.params.user_name }, {
    $addToSet: { favorites: req.params.movieID },
  },
  { new: true },
  (err) => {
    if (err) {
      res.status(404).send(`Movie with ID ${req.params.movieID} doesn't exist.`);
    } else {
      res.status(201).send(`Movie ${req.params.movieID} has been successfully added to your favorites.`);
    }
  });
});

// Remove movie from favorites
app.delete('/users/:user_name/favorites/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ user_name: req.params.user_name }, {
    $pull: { favorites: req.params.movieID },
  },
  { new: true },
  (err) => {
    if (err) {
      res.status(404).send(`Movie with ID ${req.params.movieID} doesn't exist.`);
    } else {
      res.status(201).send(`Movie ${req.params.movieID} has been successfully removed from your favorites.`);
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  /* eslint-disable-next-line */
  console.error(err.stack);
  res.status(500).send('Ups, something went wrong. Please try again.');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  /* eslint-disable-next-line */
  console.log(`Server is listening on port ${port || 8080}.`);
});
