const router = require('express').Router();
const cors = require('cors');

module.exports = function(api) {
	// Catch All
	let corsOptions = {
	  origin: ['http://localhost:3001', 'http://localhost:3000', ],
	  optionsSuccessStatus: 200,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
	};

	router.all('*', cors(corsOptions));

	router.all('*', function(req, res, next) {
		console.log('Path: ' + req.path);
		console.log('Method: ' + req.method);
		console.log('Params: ', req.params);
		console.log('Body: ');
		console.log(req.body);
		console.log('Headers: ');
		console.log(req.headers);
		next();
	});

	// Restrict All Post Requests to JSON
	router.post('*', function(req, res, next) {
		// Restrict Request to JSON
		req.accepts('application/json');
		next();
	})

	// Define Exports
	const routes = {
		auth: require('./auth'),
		rooms: require('./rooms'),
		bookings: require('./bookings'),
		uploads: require('./uploads')
	};

	// Define All Other Routes Here
	router.use('/auth/', routes.auth);
	router.use('/rooms/', routes.rooms);
	router.use('/bookings/', routes.bookings);
	router.use('/uploads/', routes.uploads);

  // Handle 404's (Final Route)
	router.use(function(req, res, next) {
		res.sendStatus(404);
	});

	return router;
};
