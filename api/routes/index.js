module.exports = function(api) {
	const cors = require('cors');
	// Catch All
	// let corsOptions = {
	//   origin: ['http://localhost:3001', 'http://localhost:3000', ],
	//   optionsSuccessStatus: 200,
	// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
	// }
	api.all('*', cors());

	api.all('*', function(req, res, next) {
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
	api.post('*', function(req, res, next) {
		// Restrict Request to JSON
		req.accepts('application/json');
		next();
	})

	// Define Exports
	const exports = {
		auth: require('./auth'),
		rooms: require('./rooms'),
		uploads: require('./uploads')
	};

	// Define All Other Routes Here
	api.use('/api/auth/', exports.auth);
	api.use('/api/rooms/', exports.rooms);
	api.use('/api/uploads/', exports.uploads);

  // Handle 404's (Final Route)
	api.use(function(req, res, next) {
		res.sendStatus(404);
	});

	return exports;
};
