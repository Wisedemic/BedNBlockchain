/* Necessary Models */
var Users = require('../models/UserModel').UserModel;

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
passport.use(new LocalStrategy(function(username, password, done) {

    // Grab our user from the database by their username.
    // Include the users Salt In this request
    Users.findOne({ username: username }).select('+salt').exec(function (err, user) {

      // Debugging
      console.log(user)

      // If the User is not Found ErrorHandling
      if (err) {
        // Return a message to the route-handler
        return done({message: 'User Not Found'});
      }

      // Check for user data
      if (!user) {
        // No user - Send route the message.
        // This error can be proccessed better, but for now, it's shit.
        return done(null, false, {el: '#login-email', error: 'Incorrect username.'});
      }

      // Validate PW
      user.validPassword(password, function(err, isMatch) {
        // If the password was false
        if (err) return done(null, false, {message: 'Authentication Error'});

        // If the password was correct
        if (isMatch) {
          // Send Success Message, along with the user data
          return done(null, user, {message: 'Login Successful'});
        // Else, Send error message
        } else {
          return done(null, false, {el: '#login-pw', error: 'Incorrect Password'})
        }
      });

    });
  }
));

module.exports = passport;
