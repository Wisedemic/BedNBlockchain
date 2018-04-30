/* Necessary Models */
var Users = require('../models/UserModel').UserModel;

// Passort.js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* Validation Library */
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

// Serialize The User.
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize The User
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Proccess user login
/* Accepets:
  Username @string
  Password @string
*/
passport.use(new LocalStrategy({usernameField: 'email'}, function(username, password, done) {

    // Grab our user from the database by their username
    Users.findOne({ email: username }).select('+salt').exec(function (err, user) {
      // If the User is not Found
      if (err) {
        return done({message: 'User Not Found'});
      }

      // Check for user data
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }

      // Validate PW
      user.validPassword(password, function(err, isMatch) {
        // If the password was false
        if (err) return done(null, false, {message: 'Authentication Error'});

        // If the password was correct
        if (isMatch) {
          // Send Success Message, along with the user data
          return done(null, user, {message: 'Login Successful'});
        } else {
          return done(null, false, {message: 'Incorrect Password'})
        }
      });
    });
  }
));

module.exports = passport;
