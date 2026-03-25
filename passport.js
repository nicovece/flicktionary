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
      try {
        const user = await Users.findOne({ Username: username });
        if (!user) {
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        if (!user.validatePassword(password)) {
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        return callback(null, user);
      } catch (error) {
        return callback(error);
      }
    }
  )
);


passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, callback) => {
  try {
    const user = await Users.findOne({ Username: jwtPayload.Username });
    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
}));