const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Movie schema defines the structure for movie documents in MongoDB.
// Nested objects like Genre and Director allow for structured subdocuments.
let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String, // Genre is a nested object with a name and description
    Description: String
  },
  Director: {
    Name: String, // Director is a nested object with a name and bio
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

// User schema defines the structure for user documents in MongoDB.
let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  // FavoriteMovies is an array of ObjectIds that reference Movie documents.
  // This allows each user to have a list of favorite movies by storing their IDs.
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Hashes a plain text password using bcrypt with a salt round of 10.
// This is used when creating or updating a user's password to securely store it in the database.
// Usage: User.hashPassword(plainTextPassword)
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Compares a plain text password to the hashed password stored in the database.
// Returns true if the password matches, false otherwise.
// Usage: user.validatePassword(plainTextPassword)
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
