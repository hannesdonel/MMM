const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/MMM', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

const topMovies = [
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'adventure',
  },
  {
    title: 'Hidden Figures',
    author: 'Margot Lee Shetterly',
    genre: 'biography',
  },
  {
    title: 'Bohemian Rapsody',
    author: ['Anthony McCarten', 'Peter Morgan'],
    genre: 'biography',
  },
  {
    title: 'Inception',
    author: 'Christopher Nolan',
    genre: 'adventure',
  },
  {
    title: 'Adam\'s Apples',
    author: 'Anders Thomas Jensen',
    genre: 'comedy',
  },
  {
    title: 'The Joker',
    author: ['Todd Phillips', 'Scott Silver'],
    genre: 'crime',
  },
  {
    title: 'Gravity',
    author: ['Alfonso Cuarón', 'Jonás Cuarón'],
    genre: 'sci-fi',
  },
  {
    title: 'The Prestige',
    author: 'Christopher Priest',
    genre: 'mystery',
  },
  {
    title: 'Mickey Blue Eyes',
    author: ['Adam Scheinman', 'Robert Kuhn'],
    genre: 'comedy',
  },
  {
    title: 'Toni Erdmann',
    author: 'Maren Ade',
    genre: 'drama',
  },
];

const users = [
  {
    id: '1',
    firstName: 'Hannes',
    lastName: 'Donel',
    mail: 'hannesdonel@mail.de',
  },
];

// Print data about all requests
app.use(morgan('common'));

// Parse request body
app.use(express.json());

// Make /public directory available
app.use('/public', express.static('public'));

// Routing for root
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

// Routing for documentation
app.get('/documentation', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/documentation.html`);
});

// Get all movies, movies by genre or by author
app.get('/movies', (req, res) => {
  if ('genre' in req.query) {
    res.status(200).json(topMovies.filter((movies) => movies.genre === req.query.genre));
  } else if ('author' in req.query) {
    res.status(200).json(topMovies.filter((movies) => movies.author.includes(req.query.author)));
  } else if ('director' in req.query) {
    res.status(200).json(topMovies.filter(
      (movies) => movies.director.includes(req.query.director),
    ));
  } else {
    res.status(200).json(topMovies);
  }
});

// Get movies by name
app.get('/movies/:title', (req, res) => {
  res.status(200).json(topMovies.find((movie) => movie.title === req.params.title));
});

// User registration
app.post('/users', (req, res) => {
  const newUser = req.body;
  const failed = 'You must specify at least your first name and mail adress.';

  if (!newUser.firstName || !newUser.mail) {
    res.status(400).send(failed);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    const success = `Thank you very much. You are now listed as: <br>${JSON.stringify(newUser)}`;
    res.status(201).send(success);
  }
});

// User deregistration
app.delete('/users/:id', (req, res) => {
  const deregUser = users.find((user) => user.id === req.params.id);

  if (deregUser) {
    // Insert a function that deletes the specific user
    res.status(200).send(`User with ID ${req.params.id} has been succesfully deleted.`);
  } else {
    res.status(404).send(`There is no user with ID ${req.params.id}`);
  }
});

// Change user data (one at a time)
app.put('/users/:id', (req, res) => {
  const changeUser = users.find((user) => user.id === req.params.id);

  if (changeUser && req.body.firstName) {
    changeUser.firstName = req.body.firstName;
    res.status(201).send(`User with ID ${req.params.id} has been succesfully updated and is now:<br>${JSON.stringify(changeUser)}`);
  } else if (changeUser && req.body.lastName) {
    changeUser.lastName = req.body.lastName;
    res.status(201).send(`User with ID ${req.params.id} has been succesfully updated and is now:<br>${JSON.stringify(changeUser)}`);
  } else if (changeUser && req.body.mail) {
    changeUser.mail = req.body.mail;
    res.status(201).send(`User with ID ${req.params.id} has been succesfully updated and is now:<br>${JSON.stringify(changeUser)}`);
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send('Please specify what values to be changed.');
  } else {
    res.status(400).send(`There is no user with ID ${req.params.id}`);
  }
});

// Add movie to favorites
app.post('/users/:id/favorites/:movieTitle', (req, res) => {
  const validUser = users.find((user) => user.id === req.params.id);
  const validMovie = topMovies.find((movie) => movie.title === req.params.movieTitle);

  if (validUser && validMovie) {
    // Insert a function that post a movie to the user's favorites (which sould be an object)
    res.status(201).send('Movie successfully added to your favorites list.');
  } else {
    res.status(400).send('Please specify a valid user and movie to be added to the user\'s favorites list');
  }
});

// Remove movie to favorites
app.delete('/users/:id/favorites/:movieTitle', (req, res) => {
  const validUser = users.find((user) => user.id === req.params.id);
  const validMovie = topMovies.find((movie) => movie.title === req.params.movieTitle);

  if (validUser && validMovie) {
    // Insert a function that post a movie to the user's favorites (which sould be an object)
    res.status(201).send('Movie successfully deleted from your favorites list.');
  } else {
    res.status(400).send('Please specify a valid user and movie to be deleted from the user\'s favorites list');
  }
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
