// DB Config. Requires Express.js
module.exports = function(api) {

	/* Requires */
	const mongoose = require('mongoose');
	const Grid = require('gridfs-stream');
	const config = require('./config.js');

	// Config
	mongoose.Promise = global.Promise;
	Grid.mongo = mongoose.mongo;

	// Define Error Handler for All Mongo Errors into JSON.
	mongoose.Model.MongoErrors = function(errs) {
		let data = [];
		let counter = 0;
		for (var label in errs.errors) {
			console.log(errs)
			const msg = errs.errors[label].properties.message;
	    data[counter] = msg;
			counter++;
		}
		return data;
	}

	// Connect to MongoDB
	mongoose.connect(config.mongoURL, function (err, res) {
		// mongoose.connection.db.dropDatabase();
	  if (err) {
	    console.log('[DB] Connection to MongoDB failed!. ' + err);
	  } else {
	    console.log('[DB] Successfully connected to MongoDB Server');

			// On Success, connect GridFS to mongoose.db instance.
			const gridfs = new Grid(mongoose.connection.db);

			// Make it available to express.
			api.set('gridfs', gridfs);

			// Setup GridFS Mongoose Model for Other Models to reference.
			const GFS = require('../models/GridFSModel');
	  }
	});
}
