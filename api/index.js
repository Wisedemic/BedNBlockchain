console.log('[SERVER] Bed\'N\'Blockchain API starting.');

// Setup Express Server
const express = require('express');
const api = express();

// Middleware
const bodyParser = require('body-parser'); //bodyparser + json + urlencoder
const morgan = require('morgan'); // logger
const validator = require('express-validator'); // Validator

// Session Handling
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

// Config
var db = require('./config/database'); // DB Config
var passport = require('./config/passport'); // User Auth Config
var config = require('./config/config'); // Secret Stuff

// Setup Post Validation Library
api.use(validator());

// Configuration
api.set('port', 3001); // Set Port Globally
console.log(process.env)
api.set('secret', config.secret);
api.listen(api.get('port')); // Define listening Port
api.use(session({
    maxAge: 100*60*60,
    secret: api.get('secret'),
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({url: config.mongoURL})
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
