const express = require('express');
const morgan = require('morgan');

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

// Print data about all requests.
app.use(morgan('common'));

// Routing for root.
app.get('/', (req, res) => {
  res.send('Welcome to yet another movie database. This one is a really special one as you may only find films that are awfully great. Sounds pretty nice, right? Well, to say the least, it is!');
});

// Routing as described in documentation.
app.get('/movies', (req, res) => {
  if ('genre' in req.query) {
    res.json(topMovies.filter((movies) => movies.genre === req.query.genre));
  } else if ('author' in req.query) {
    res.json(topMovies.filter((movies) => movies.author.includes(req.query.author)));
  } else {
    res.json(topMovies);
  }
});

app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) => movie.title === req.params.title));
});

app.get('/directors/:name', (req, res) => {
/* eslint-disable-next-line */
  res.json(DIRECTORS_DATABASE.find((director) => director.name === req.params.name));
});

// Routing for /public directory including documentation.
app.use('/public', express.static('public'));

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
