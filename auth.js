const dotenv = require('dotenv');
dotenv.config();
const jwtSecret = process.env.JWT_SECRET; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file

/**
 * Generates a JWT token for a user.
 * @function
 * @name POST / generateJWTToken
 * @param {Object} user - The user object
 * @returns {string} The JWT token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you're encoding in the JWT
    expiresIn: '7d', // This expires the token in 7 days
    algorithm: 'HS256' // This is the algorithm used to sign the token
  });
}

module.exports = (router) => {
  /**
   * Authenticates a user and returns a JWT token.
   * @name POST / Login
   * @route POST /login
   * @param {Object} req.body - The login credentials
   * @param {string} req.body.Username - The user's username
   * @param {string} req.body.Password - The user's password
   * @returns {Object} 200 - The authenticated user object and JWT token
   * @returns {Object} 400 - Authentication failed
   * @example
   * // Response Example:
   * {
   *   "user": {
   *     "_id": "...",
   *     "Username": "john_doe",
   *     "Email": "john.doe@example.com",
   *     ...
   *   },
   *   "token": "<JWT_TOKEN>"
   * }
   */
  // The '/login' endpoint authenticates a user using Passport's 'local' strategy.
  // 'passport.authenticate' is called with:
  //   - 'local': This tells Passport to use the local strategy (username/password).
  //   - { session: false }: Disables persistent login sessions (we use JWTs instead of sessions).
  // The callback receives three parameters:
  //   - error: Any error that occurred during authentication.
  //   - user: The authenticated user object if credentials are valid, or 'false' if not.
  //   - info: Additional information (e.g., error messages from the strategy).
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      // If authentication fails (error or no user), return a 400 response.
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      // If authentication succeeds, log the user in (without creating a session).
      // req.login is needed to establish req.user for the rest of the request lifecycle.
      // { session: false } ensures no session is created (stateless JWT auth).
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        // On successful login, generate a JWT for the user and return it in the response.
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}