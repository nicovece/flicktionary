const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt'),
  dotenv = require('dotenv');

  dotenv.config();

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    async (username, password, callback) => {
      await Users.findOne({ Username: username })
      .then((user) => {
        if (!user) {
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        if (!user.validatePassword(password)) {
          console.log('incorrect password');
          return callback(null, false, {
            message: 'Incorrect password.',
          });
        }
        return callback(null, user);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, callback) => {
  console.log('JWT Payload:', jwtPayload);
  console.log('JWT Secret:', process.env.JWT_SECRET);
  return await Users.findOne({ Username: jwtPayload.Username })
    .then((user) => {
      console.log('Found user:', user ? 'Yes' : 'No');
      return callback(null, user);
    })
    .catch((error) => {
      console.log('Error finding user:', error);
      return callback(error)
    });
}));