console.log('[SERVER] Bed\'N\'Blockchain API starting....');

// Setup Express Server
const express = require('express');
const api = express();

// Middleware
const bodyParser = require('body-parser'); //bodyparser + json + urlencoder
const morgan = require('morgan'); // logger
const validator = require('express-validator'); // Validator
const cors = require('cors'); // CORS Headers

// Session Handling
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

// Config
let db = require('./config/database')(api); // DB Config
let passport = require('./config/passport'); // User Auth Config
let config = require('./config/config'); // Secret Stuff
let corsOptions = { // CORS Configuration is done here!
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

// Setup Post Validation Library
api.use(validator());

// Configuration
api.set('port', 3001); // Set Port Globally
api.set('secret', config.secret);
api.listen(api.get('port')); // Define listening Port
api.use(session({
    maxAge: 100*60*60,
    secret: api.get('secret'),
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({url: config.mongoURL})
}));

// Run all routes through these middleware fn's
api.all('*', cors(corsOptions), function(req, res, next) {
	req.accepts('application/json');
	console.log('Path: ' + req.path);
	console.log('Method: ' + req.method);
	console.log('Params: ', req.params);
	console.log('Body: ');
	console.log(req.body);
	console.log('Headers: ');
	console.log(req.headers);
	next();
});


// Session Setup + Passport Init
api.use(passport.initialize());
api.use(passport.session());

// Parse application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
api.use(bodyParser.json());

// Routes
const routes = require('./routes/')(api);
api.use('/api/', routes);

console.log('[SERVER] Bed\'N\'Blockchain API started on port ' + api.get('port'));
