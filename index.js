const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MMM', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(morgan('common'));
app.use(express.json());

const passport = require('passport');
require('./passport');
const auth = require('./auth')(app);
const Models = require('./models');

const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

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
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  const genreQuery = req.query.genre;
  const actorQuery = req.query.actor;
  if (genreQuery && actorQuery) {
    Movies.find({ genre: genreQuery, actors: actorQuery }).populate('genre').populate('director').then((movies) => {
      if (movies.length === 0) {
        res.status(404).send(`Found no movie with genre ${genreQuery} starring ${actorQuery}.`);
      } else {
        res.status(200).json(movies);
      }
    })
      .catch((error) => res.status(500).send(`Error: ${error}`));
  } else if (actorQuery) {
    Movies.find({ actors: actorQuery }).populate('genre').populate('directors').then((movies) => {
      if (movies.length === 0) {
        res.status(404).send(`Found no movie starring ${actorQuery}.`);
      } else {
        res.status(201).json(movies);
      }
    })
      .catch((error) => res.status(500).send(`Error: ${error}`));
  } else if (genreQuery) {
    Movies.find({ genre: genreQuery }).populate('genre').populate('director').then((movies) => {
      if (movies.length === 0) {
        res.status(404).send(`Found no movie with genre ${genreQuery}.`);
      } else {
        res.status(200).json(movies);
      }
    })
      .catch((error) => res.status(500).send(`Error: ${error}`));
  } else {
    Movies.find({}).populate('genre').populate('director').then((movies) => {
      if (movies.length === 0) {
        res.status(500).send('Something went wrong, please try again later.');
      } else {
        res.status(200).json(movies);
      }
    })
      .catch((error) => res.status(500).send(`Error: ${error}`));
  }
});

// Get movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ title: req.params.title }).populate('genre').populate('director').then((movie) => {
    if (movie.length === 0) {
      res.status(404).send(`There is no movie entitled ${req.params.title}`);
    } else {
      res.status(200).json(movie);
    }
  })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// GENRES SECTION

// Get all genres
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find({}).then((genres) => {
    res.status(200).json(genres);
  })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// Get genre by name
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find({ name: req.params.name }).then((genre) => {
    if (genre.length === 0) {
      res.status(404).send(`Sorry, I couldn't find a genre named ${req.params.name}.`);
    } else {
      res.status(200).json(genre);
    }
  })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// DIRECTORS SECTION

// Get all directors
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find({}).then((directors) => {
    res.status(200).json(directors);
  })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// Get director by name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find({ name: req.params.name }).then((director) => {
    if (director.length === 0) {
      res.status(404).send(`Sorry, I couldn't find a genre named ${req.params.name}.`);
    } else {
      res.status(200).json(director);
    }
  })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// USERS SECTION

/* User registration

We'll expect JSON in this format:
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birth_date: Date,
*/

app.post('/users', (req, res) => {
  Users.findOne({ user_name: req.body.user_name })
    .then((user) => {
      if (user && Object.keys(req.body).length > 0) {
        res.status(400).send(`${req.body.user_name} already exists. Please choose another username.`);
      } else {
        Users
          .create({
            user_name: req.body.user_name,
            password: req.body.password,
            email: req.body.email,
            birth_date: req.body.birth_date,
          })
          .then((newUser) => { res.status(201).send(`You are now registered as:<br>${JSON.stringify(newUser)}`); })
          .catch((error) => res.status(500).send(`Error: ${error}`));
      }
    })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// User deregistration by ID
app.delete('/users/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ _id: req.params._id })
    .then((user) => {
      if (!user) {
        res.status(404).send(`There's no user with ID ${req.params._id}.`);
      } else {
        res.status(201).send(`User ${req.params._id} successfully deleted.`);
      }
    })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// Get information about a user by name.
app.get('/users/:user_name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ user_name: req.params.user_name })
    .then((user) => {
      if (!user) {
        res.status(404).send(`User ${req.params.user_name} doesn't exist.`);
      } else {
        res.status(200).json(user);
      }
    })
    .catch((error) => res.status(500).send(`Error: ${error}`));
});

// Change user data (one at a time) by ID
/* We’ll expect JSON in this format
{
  user_name: String,(required)
  password: String,(required)
  email: String,(required)
  birth_date: Date
} */
app.put('/users/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ _id: req.params._id }, {
    $set:
    {
      user_name: req.body.user_name,
      password: req.body.password,
      email: req.body.email,
      birth_date: req.body.birth_date,
    },
  },
  { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(201).json(updatedUser);
      } else {
        res.status(500).send('Something went wrong, try again.');
      }
    }).catch((error) => res.status(500).send(`Error: ${error}`));
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

app.listen(8080, () => {
  /* eslint-disable-next-line */
  console.log('Server is listening on port 8080.');
});
