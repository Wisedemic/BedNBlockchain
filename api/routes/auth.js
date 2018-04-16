/* Express Router */
var express = require('express');
var auth = express.Router();

/* Necessary Models */
var Users = require('../models/UserModel').UserModel;

/* User Auth Library */
var passport = require('passport');

/* Validation Library */
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');

/* Helpers */
const helpers = require('../config/helpers.js');
const generateName = require('sillyname');
const randomstring = require("randomstring");
const extend = require('util')._extend;

// Login Submit Handling
auth.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, message) {
		// Throw Any Errors
		if (err) return next(err); // will generate a 500 error

		// Incorrect Username Error
		if (!user) return res.json({error: true, message: [message] });

		// Submit login request using the user found in this request.
		req.logIn(user, function (err) {
		    if (err) return next(err);
				console.log('req.login successful!');

					console.log(req.user);
					
				const payload = {user: {
					email: user.email,
					updated_at: user.updated_at,
					created_at: user.created_at,
					token: helpers.generateAndStoreToken(req, user)
				}}
				return res.json({payload});
		});
	})(req, res, next);
});

// Check Token for current Users request.
auth.get('/', function(req, res, next) {
	res.json({payload: {user: {name: 'hi'}}})
});

// Register a new User
auth.post('/signup', function(req, res, next) {
	var errors = [];
	if (!req.body.email) errors.push({key: 'email', message: 'This field is required'});
	if (!req.body.password) errors.push({key: 'password', message: 'This field is required'});
	if (!req.body.passwordConfirm) errors.push({key: 'passwordConfirm', message: 'This field is required'});

	// If we had errors
	if (errors.length > 0) {
		return res.json(errors);
	// If Passwords didnt Match
	} else if (req.body.password !== req.body.passwordConfirm) {
		errors.push({key: 'password', message: 'Passwords Do Not Match'});
		errors.push({key: 'passwordConfirm', message: 'Passwords Do Not Match'});
		return res.json({error: true, payload: {errors}});
	} else {

		// Delete the confirmed password and pass req.body
		delete req.body.passwordConfirm;

		// Create the user
		Users.create(req.body, function(err, user) {
			console.log('User Create function Complete.', err, user);
			if (err) {
				if (err.code === 11000) {
					return res.json({error: true, payload: {errors: 'Email Already Registered!'}})
				} else {
					return res.json({error: true, payload: {errors: Users.MongoErrors(err)}});
				}
			}
			if (user.created_at) {
				// Authenticate them through Passport.js through our API.
				req.login(user, function (err) {
					if (!err) {
						console.log('req.login successful!');
						const payload = {user: {
							email: user.email,
							updated_at: user.updated_at,
							created_at: user.created_at,
							token: helpers.generateAndStoreToken(req, user)
						}}
						return res.json({payload});
					} else {
						console.log('req.login errors: ', err);
						return res.json({
							error: true,
							payload: {errors: 'Something Unexpected Happened'}
						})
					}
				})
			}
		});
	}
});

// User selected to proceed as guest.
auth.post('/guest', function(req, res, next) {
	var guest = {
		role: 'guest',
		username: generateName.randomAdjective() + generateName.randomNoun(),
		password: randomstring.generate({
			length: 12,
			charset: 'alphabetic'
		})
	};

	Users.create(guest, function(err, user) {
		if (err) return res.json({success: false, message: Users.MongoErrors(err)});
		if (user.created_at) {
			req.login(user, function (err) {
				helpers.generateAndStoreToken(req, user);
				if ( ! err ) return res.json({success: true});
			});
		}
	});
});

// Validate the Username on the fly
auth.post('/validusername', function(req, res, next) {

	// Check length
	if (req.body.username.length < 4 || req.body.username.length > 16) {
		return res.json({
			success: false,
			message: [{el: '#username', error: "Must be Between 4-16 characters"}]
		});

	// Restrict characters usable.
	// 'A-Z', 'a-z', '0-9', '_', '.' ONLY
	} else if(/[^A-Za-z0-9_.]/.test(req.body.username)) {
		return res.json({
			success: false,
			message: [{el: '#username', error: "Must Contain characters 'A-z', '0-9', '_', '-', '.'"}]
		});

	} else {
		if (req.body.username.length > 0) {
			// Check for user
			Users.find({username: req.body.username}).exec(function(err, user) {
				if (err) {console.log(err); }

				if (user.length) {
					return res.json({
						success: false,
						message: [{el: '#username', error: 'Username already exists!'}]
					});
				} else {
					return res.json({
						success: true,
						message: [{el: '#username', error: 'Valid Username'}]
					});
				}
			});
			//otherwise return an error.
		}
		else {
			return res.json({
				success: false,
				message: [{el: '#username', error: 'No Username Entered'}]
			});
		}
	} // End else
});

// Logout Request Handling
auth.post('/logout', function(req, res, next) {
	req.logout();
	req.session.destroy();
	res.sendStatus(200);
});

module.exports = auth;
