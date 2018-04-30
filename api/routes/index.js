/* Requires */
const router = require('express').Router();
const cors = require('cors');

// Export all routes to express
module.exports = function(api) {

	// CORS Configuration is done here!
	let corsOptions = {
	  origin: ['http://localhost:3001', 'http://localhost:3000', ],
	  optionsSuccessStatus: 200,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
	};

	// Run all routes through these middleware fn's
	router.all('*', cors(corsOptions), function(req, res, next) {
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

	// Define All Other Routes Here
	router.use('/auth/', require('./auth'));
	router.use('/rooms/', require('./rooms'));
	router.use('/bookings/', require('./bookings'));
	router.use('/uploads/', require('./uploads'));

  // Handle 404 (Final Route)
	router.use(function(req, res, next) {
		res.sendStatus(404);
	});

	// Export all express routes.
	return router;
};
