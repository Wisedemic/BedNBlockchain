console.log('[SERVER] Bed\'N\'Blockchain API starting.');

// Setup Express Server
const express = require('express');
const api = express();

// Middleware
const bodyParser = require('body-parser'); //bodyparser + json + urlencoder
const morgan = require('morgan'); // logger
const validator = require('express-validator'); // Validator

// Config
var db = require('./config/database'); // DB Config
var passport = require('./config/passport'); // User Auth Config
var config = require('./config/config'); // Secret Stuff

// Setup Post Validation Library
api.use(validator());

// Configuration
// auth.set('port', process.env.PORT);
api.set('port', 3001); // Set Port Globally
api.set('secret', config.secret);
api.listen(api.get('port')); // Define listening Port
api.use(require('express-session')({
    maxAge: 100*60*60,
    secret: api.get('secret'),
    resave: false,
    saveUninitialized: false
}));

// Session Setup + Passport Init
api.use(passport.initialize());
api.use(passport.session());

// Parse application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
api.use(bodyParser.json());

// Routes
const routes = require('./routes/')(api);
console.log('[SERVER] Bed\'N\'Blockchain API started on port ' + api.get('port'));
