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
		if (!user) return res.json({error: true, errors: [message]});

		// Submit login request using the user found in this request.
		req.logIn(user, function (err) {
		    if (err) return next(err);
				console.log('req.login successful!');
				console.log(req.user);
				const token = helpers.generateAndStoreToken(req, user);
				const payload = {user: {
					id: user._id,
					email: user.email,
					token: token.key,
					created_at: user.created_at,
					updated_at: user.updated_at
				}};
				return res.json({payload});
		});
	})(req, res, next);
});

auth.get('/', helpers.validateToken, function(req, res, next) {
	let token = req.headers.authorization.split(' ')[1];
	Users
		.findOne({ 'token.key': token })
		.lean()
		.exec(function (err, user) {
		if (err) {
			console.log(err, user);
			res.json({error: true, errors: ['Token not associated to a User!']});
		}
		if (user) {
			console.log(err, user);
			const payload = {user: {
				id: user._id,
				email: user.email,
				token: user.token.key,
				created_at: user.created_at,
				updated_at: user.updated_at
			}};
			res.json({payload});
		} else {
			console.log(err, user);
			res.json({error: true, errors: ['Token not associated to a User!']});
		}
	});
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
					return res.json({error: true, errors: ['Email Already Registered!']});
				} else {
					return res.json({error: true, errors: [Users.MongoErrors(err)]});
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
						console.log(user)
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

module.exports = auth;
