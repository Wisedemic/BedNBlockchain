module.exports = function(app) {
	const cors = require('cors');
	// Catch All
	var corsOptions = {
	  origin: ['http://localhost:3001', 'http://localhost:3000'],
	  optionsSuccessStatus: 200,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
	}
	app.all('*', cors(corsOptions));

	app.all('*', function(req, res, next) {
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
	app.post('*', function(req, res, next) {
		// Restrict Request to JSON
		req.accepts('application/json');
		next();
	})

	// Define Exports
	const exports = {
		auth: require('./auth')
	};

	// Define All Other Routes Here
	app.use('/api/auth/', exports.auth);

  // Handle 404's (Final Route)
	app.use(function(req, res, next) {
		res.sendStatus(404);
	});

	return exports;
};
