const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose');

const app = express();

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/flicktionary', { useNewUrlParser: true, useUnifiedTopology: true });
/*
useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.

ref.: https://mongoosejs.com/docs/6.x/docs/migrating_to_6.html

*/
mongoose.connect('mongodb://localhost:27017/flicktionary');

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
      Name: 'Sci-fi',
      Description:
        'Science fiction is a genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.'
    },
    Director: {
      Name: 'John Favreau',
      Bio: 'Jonathan Kolia Favreau is an American actor and filmmaker. As an actor, Favreau has appeared in films such as Rudy, PCU, Swingers, Very Bad Things, Deep Impact, The Replacements, Daredevil, The Break-Up, Four Christmases, Couples Retreat, I Love You, Man, People Like Us, The Wolf of Wall Street, and Chef. ',
      Birth: 'October 19, 1966'
    },
    ImageURL:
      'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3546118_p_v10_af.jpg'
  },
  {
    Title: 'Captain America: The Winter Soldier',
    Description:
      'After the cataclysmic events in New York with his fellow Avengers, Steve Rogers, aka Captain America (Chris Evans), lives in the nation\'s capital as he tries to adjust to modern times. An attack on a S.H.I.E.L.D. colleague throws Rogers into a web of intrigue that places the whole world at risk. Joining forces with the Black Widow (Scarlett Johansson) and a new ally, the Falcon, Rogers struggles to expose an ever-widening conspiracy, but he and his team soon come up against an unexpected enemy.',
    Genre: {
      Name: 'Adventure',
      Description:
        'Adventure films are a genre of film that typically use their action scenes to display and explore exotic locations in an energetic way.'
    },
    Director: {
      Name: 'Joe & Anthony Russo',
      Bio: 'Anthony Russo is an American film director and producer. He is best known for directing four installments of the Marvel Cinematic Universe franchise, Captain America: The Winter Soldier, Captain America: Civil War, Avengers: Infinity War, and Avengers: Endgame.',
      Birth: 'February 3, 1970'
    },
    ImageURL:
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTfP_GN63NrHEjZ4unvJbGE7neVs5W_6SlUmYHscaXhUSHMkce3eYBL8eiDbwRt4e0oCv0n'
  },
  {
    Title: 'John Wick',
    Description:
      'John Wick is a former hitman grieving the loss of his true love. When his home is broken into, robbed, and his dog killed, he is forced to return to action to exact revenge.',
    Genre: {
      Name: 'Action',
      Description:
        'Action films are a film genre where the primary emphasis is on the action. These films are characterized by a lot of physical activity (stunts, chases, fights, battles and explosions).'
    },
    Director: {
      Name: 'Chad Stahelski',
      Bio: 'Chad Stahelski is an American stuntman and film director. He is known for directing the 2014 film John Wick along with David Leitch, and solo directing its two sequels.',
      Birth: 'September 20, 1968'
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

// parse request body
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('We have a problem, something gone wrong!');
});

// Endpoints

// Root page
app.get('/', (req, res) => {
  // const title = '<h1>F L I C K T I O N A R Y</h1>';
  // const description = '<h2>A dictionary, but only for flicks.</h2>';
  // res.send(title + description);
  res.sendFile('public/index.html', { root: __dirname });
});

// Movies endpoints

// Return a list of ALL movies to the user
app.get('/movies', async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a single movie by title to the user
app.get('/movies/:Title', async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a genre
app.get('/movies/genre/:genreName', async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
  .then((movie) => {
      res.json(movie.Genre);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  })
});

// Return data about a director
app.get('/movies/director/:directorName', async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
  .then((movie) => {
      res.json(movie.Director);
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  })
});

//Users endpoints

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow new users to register
/*
Expected JSON format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}
*/
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update user (by Username) info
/*
Expected JSON format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}
*/
app.put('/users/:Username', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // return the updated (new) document
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  })

});

// Allow users to add a movie to their list of favorites

app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Allow existing users to deregister
app.delete('/users/:Username', async (req, res) => {
  /*
  Model.findOneAndRemove() gave me an error: "is not a function." The references to the MongoDB querying functions in the exercise are outdated. The page redirects to the new documentation, where there is no mention of Model.findOneAndRemove(). Instead, I used Model.findOneAndDelete().
  */
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send('User with username "' + req.params.Username + ' " successfully removed.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
