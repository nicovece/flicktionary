const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

// log all requests to log.txt
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
});

// Sample data - 2 users
let users = [
  {
    id: 1,
    name: 'Paul',
    favoriteMovies: []
  },
  {
    id: 2,
    name: 'Nico',
    favoriteMovies: ['John Wick']
  }
];

// Sample data - 3 movies
let movies = [
  {
    Title: 'Iron Man 2',
    Description:
      'With the world now aware that he is Iron Man, billionaire inventor Tony Stark (Robert Downey Jr.) faces pressure from all sides to share his technology with the military. He is reluctant to divulge the secrets of his armored suit, fearing the information will fall into the wrong hands. With Pepper Potts (Gwyneth Paltrow) and Rhodey (Don Cheadle) by his side, Tony must forge new alliances and confront a powerful new enemy.',
    Genre: {
      Name: 'Sci-fi'
    },
    Director: {
      Name: 'John Favreau'
    },
    ImageURL:
      'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3546118_p_v10_af.jpg'
  },
  {
    Title: 'Captain America: The Winter Soldier',
    Description:
      'After the cataclysmic events in New York with his fellow Avengers, Steve Rogers, aka Captain America (Chris Evans), lives in the nation\'s capital as he tries to adjust to modern times. An attack on a S.H.I.E.L.D. colleague throws Rogers into a web of intrigue that places the whole world at risk. Joining forces with the Black Widow (Scarlett Johansson) and a new ally, the Falcon, Rogers struggles to expose an ever-widening conspiracy, but he and his team soon come up against an unexpected enemy.',
    Genre: {
      Name: 'Adventure'
    },
    Director: {
      Name: 'Joe & Anthony Russo'
    },
    ImageURL:
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTfP_GN63NrHEjZ4unvJbGE7neVs5W_6SlUmYHscaXhUSHMkce3eYBL8eiDbwRt4e0oCv0n'
  },
  {
    Title: 'John Wick',
    Description:
      'John Wick is a former hitman grieving the loss of his true love. When his home is broken into, robbed, and his dog killed, he is forced to return to action to exact revenge.',
    Genre: {
      Name: 'Action'
    },
    Director: {
      Name: 'Chad Stahelski'
    },
    ImageURL:
      'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg'
  }
];

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

// GET requests
app.get('/', (req, res) => {
  let title = '<h1>F L I C K T I O N A R Y</h1>';
  let description = '<h2>A dictionary, but only for flicks.</h2>';
  res.send(title + description);
});

app.get('/movies', (req, res) => {
  res.json(movies);
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
