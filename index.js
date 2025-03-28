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

// Middleware

// log all requests to log.txt
app.use(morgan('combined', { stream: accessLogStream }));

// serve static files
app.use(express.static('public'));

// parse request body
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 

// CORS
const cors = require('cors');
app.use(cors());

// Authentication & Authorization
// import auth.js
let auth = require('./auth')(app);
// import passport.js
const passport = require('passport');
require('./passport');

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
app.get('/movies', passport.authenticate('jwt', { session: false}), async (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), async (req, res) => {
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
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false}), async (req, res) => {
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
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false}), async (req, res) => {
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
app.get('/users', passport.authenticate('jwt', { session: false}), async (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
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
  // hash password
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user),
            console.log(user);
           })
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  // Check if same user as logged in
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
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

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), async (req, res) => {
  // Check if same user as logged in
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), async (req, res) => {
  // Check if same user as logged in
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  // Check if same user as logged in
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
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
