/* Requires */
const router = require('express').Router();

// Export all routes to express
module.exports = function(api) {

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
