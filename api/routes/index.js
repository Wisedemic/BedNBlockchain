module.exports = function(app) {
	// Catch All
	app.all('*', function(req, res, next) {
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Credentials', true);
		res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
		res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

		console.log('Method: ' + req.method);
		console.log(req.params);
		console.log('Body: ');
		console.log(req.body);
		console.log(req.path);
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
