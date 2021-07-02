const express = require('express');
const morgan = require('morgan');

const app = express();

const topMovies = [
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien',
  },
  {
    title: 'Hidden Figures',
    author: 'Margot Lee Shetterly',
  },
  {
    title: 'Bohemian Rapsody',
    author: ['Anthony McCarten', 'Peter Morgan'],
  },
  {
    title: 'Inception',
    author: 'Christopher Nolan',
  },
  {
    title: 'Adam\'s Apples',
    author: 'Anders Thomas Jensen',
  },
  {
    title: 'The Joker',
    author: ['Todd Phillips', 'Scott Silver'],
  },
  {
    title: 'Gravity',
    author: ['Alfonso Cuarón', 'Jonás Cuarón'],
  },
  {
    title: 'The Prestige',
    author: 'Christopher Priest',
  },
  {
    title: 'Mickey Blue Eyes',
    author: ['Adam Scheinman', 'Robert Kuhn'],
  },
  {
    title: 'Toni Erdmann',
    author: 'Maren Ade',
  },
];

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Welcome to yet another movie database. This one is a really special one as you may only find films that are awfully great. Sounds pretty nice, right? Well, to say the least, it is!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  /* eslint-disable-next-line */
  console.error(err.stack);
  res.status(500).send('Ups, something went wrong. Please try again.');
});

app.listen(8080, () => {
  /* eslint-disable-next-line */
  console.log('Server is listening on port 8080.');
});
