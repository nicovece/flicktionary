const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  dotenv = require('dotenv'),
  {check, validationResult} = require('express-validator');

dotenv.config();

const app = express();

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/flicktionary', { useNewUrlParser: true, useUnifiedTopology: true });
/*
useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.

ref.: https://mongoosejs.com/docs/6.x/docs/migrating_to_6.html

*/
/* local connection */
// mongoose.connect('mongodb://localhost:27017/flicktionary');
/* atlas connection */
mongoose.connect(process.env.CONNECTION_URI);

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
let allowedOrigins = ['http://localhost:8080', 'https://flicktionary.onrender.com', 'http://localhost:1234', 'https://flicktionary.netlify.app'];

app.use(cors({
      origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

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
  try {
    const movies = await Movies.find();
    if (!movies || movies.length === 0) {
      return res.status(404).send('No movies found');
    }
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Return data about a single movie by title to the user
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { Title } = req.params;
  try {
    const movie = await Movies.findOne({ Title: Title });
    if (!movie) {
      return res.status(404).send('Movie with title "' + Title + '" not found');
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Return data about a genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { genreName } = req.params;
  try {
    const movie = await Movies.findOne({ "Genre.Name": genreName });
    if (!movie) {
      return res.status(404).send('Genre "' + genreName + '" not found');
    }
    res.json(movie.Genre);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Return data about a director
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { directorName } = req.params;
  try {
    const movie = await Movies.findOne({ "Director.Name": directorName });
    if (!movie) {
      return res.status(404).send('Director "' + directorName + '" not found');
    }
    res.json(movie.Director);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Users endpoints

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false}), async (req, res) => {
  try {
    const users = await Users.find();
    if (!users || users.length === 0) {
      return res.status(404).send('No users found');
    }
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { Username } = req.params;
  try {
    const user = await Users.findOne({ Username: Username });
    if (!user) {
      return res.status(404).send('User ' + Username + ' not found');
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
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
app.post('/users', [
  check('Username', 'Username is required and must be at least 5 characters long.').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Email').isEmail().withMessage('Email does not have a valid format'),
  check('Password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-_=+;:,.]).{8,}$/)
    .withMessage('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters')
], async (req, res) => {
  try {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // hash password
    let hashedPassword = Users.hashPassword(req.body.Password);

    // Check if username already exists
    const existingUser = await Users.findOne({ Username: req.body.Username });
    
    if (existingUser) {
      return res.status(400).send(req.body.Username + ' already exists');
    }

    // Create new user
    const user = await Users.create({
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Update user (by Username) info
/*
Expected JSON format
{
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}
*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), [
  check('Username').isLength({min: 5}).withMessage('Username must be at least 5 characters long').isAlphanumeric().withMessage('Username contains non alphanumeric characters'),
  check('Email').optional().isEmail().withMessage('Email does not have a valid format'),
  check('Password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\-_=+;:,.]).{8,}$/)
    .withMessage('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters')
], async (req, res) => {
  
  // Check if same user as logged in or is Nico
  if (req.user.Username !== req.params.Username && req.user.Username !== 'nicovece') {
    return res.status(400).send('Permission denied');
  }
  
  // check the validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  try {
    // Create update object conditionally
    const updateFields = {
      Username: req.body.Username
    };

    if (req.body.Email) {
      updateFields.Email = req.body.Email;
    }
    
    // Only add password if it exists in the request
    if (req.body.Password) {
      updateFields.Password = Users.hashPassword(req.body.Password);
    }
    
    // Only add birthday if it exists in the request
    if (req.body.Birthday) {
      updateFields.Birthday = req.body.Birthday;
    }
    
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $set: updateFields },
      { new: true } // return the updated (new) document
    );
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { Username, MovieID } = req.params;
  // Check if same user as logged in or is Nico
  if (req.user.Username !== Username && req.user.Username !== 'nicovece') {
    return res.status(400).send('Permission denied');
  }
  try {
    // Check if movie exists
    const newFavoriteMovie = await Movies.findById(MovieID);
    if (!newFavoriteMovie) {
      return res.status(404).send('Movie with ID ' + MovieID + ' not found');
    }

    // Check if user exists and if movie is already in favorites
    const user = await Users.findOne({ Username: Username });
    if (!user) {
      return res.status(404).send('User ' + Username + ' not found');
    }
    if (user.FavoriteMovies.includes(MovieID)) {
      return res.status(400).send('Movie is already in favorites');
    }

    const updatedUser = await Users.findOneAndUpdate(
      { Username: Username },
      { $push: { FavoriteMovies: MovieID } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { Username, MovieID } = req.params;
  // Check if same user as logged in or is Nico
  if (req.user.Username !== Username && req.user.Username !== 'nicovece') {
    return res.status(400).send('Permission denied');
  }
  try {
    // Check if movie exists
    const movie = await Movies.findById(MovieID);
    if (!movie) {
      return res.status(404).send('Movie with ID ' + MovieID + ' not found');
    }

    // Check if user exists and if movie is in favorites
    const user = await Users.findOne({ Username: Username });
    if (!user) {
      return res.status(404).send('User ' + Username + ' not found');
    }
    if (!user.FavoriteMovies.includes(MovieID)) {
      return res.status(400).send('Movie is not in favorites');
    }

    const updatedUser = await Users.findOneAndUpdate(
      { Username: Username },
      { $pull: { FavoriteMovies: MovieID } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Allow existing users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { Username } = req.params;
  // Check if same user as logged in or is Nico
  if (req.user.Username !== Username && req.user.Username !== 'nicovece') {
    return res.status(400).send('Permission denied');
  }
  try {
    // Check if user exists
    const user = await Users.findOne({ Username: Username });
    if (!user) {
      return res.status(404).send('User ' + Username + ' was not found');
    }

    // Delete the user
    await Users.findOneAndDelete({ Username: Username });
    res.status(200).send('User with username "' + Username + '" successfully removed.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on port ' + port);
});
