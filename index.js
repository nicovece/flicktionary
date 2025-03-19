const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

// log all requests to log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
});

// Middleware

// log all requests to log.txt
app.use(morgan('combined', { stream: accessLogStream }));

// serve static files
app.use(express.static('public'));

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('We have a problem, something gone wrong!');
});

// Sample data - 10 movies
const topMovies = [
  {
    title: 'Inception',
    year: 2010,
    director: 'Christopher Nolan',
    genre: 'Action, Adventure, Sci-Fi'
  },
  { title: 'The Dark Knight', year: 2008, director: 'Christopher Nolan' },
  {
    title: 'Pulp Fiction',
    year: 1994,
    director: 'Quentin Tarantino',
    genre: 'Crime, Drama'
  },
  {
    title: 'The Matrix',
    year: 1999,
    director: 'Lana & Lilly Wachowski',
    genre: 'Action, Sci-Fi'
  },
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont',
    genre: 'Drama'
  },
  {
    title: 'Fight Club',
    year: 1999,
    director: 'David Fincher',
    genre: 'Drama'
  },
  {
    title: 'Interstellar',
    year: 2014,
    director: 'Christopher Nolan',
    genre: 'Adventure Drama, Sci-Fi'
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    director: 'Robert Zemeckis',
    genre: 'Drama, Romance'
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
    director: 'Peter Jackson',
    genre: 'Action, Adventure, Drama'
  },
  {
    title: 'Gladiator',
    year: 2000,
    director: 'Ridley Scott',
    genre: 'Action, Adventure, Drama'
  }
];

// GET requests
app.get('/', (req, res) => {
  let title = '<h1>F L I C K T I O N A R Y</h1>';
  let description = '<h2>A dictionary, but only for flicks.</h2>';
  res.send(title + description);
});

// app.get("/documentation", (req, res) => {
//   res.sendFile("public/documentation.html", { root: __dirname });
// });

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
