/* Express Router */
var express = require('express')
var auth = express.Router();

/* Necessary Models */
// var Users = require('../models/UserModel').UserModel;

/* User Auth Library */
var passport = require('passport');

/* Validation Library */
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

// Login POST
auth.post('/', function(req, res, next) {
	passport.authenticate('local', function(err, user, message) {
		// Fix Duplicate Nested 'Message' Keys
		if (message.message) {
			message = message.message
		}
		// Throw Any Errors
		if (err) {
			return next(err); // will generate a 500 error
		}
		// Incorrect Username Error
		if (! user) {
			return res.send({ success : false, message });
		}
		req.logIn(user, function (err) {
      if (err) {
          return next(err);
      }
      return res.send({ success : true, message });
		});
	})(req, res, next);
});

module.exports = auth;
