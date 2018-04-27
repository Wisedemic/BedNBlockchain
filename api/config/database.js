module.exports = function(api) {	/* DB Config */

	const mongoose = require('mongoose');
	const Grid = require('gridfs-stream');
	const config = require('./config.js');

	mongoose.Promise = global.Promise;
	Grid.mongo = mongoose.mongo;

	// Define Error Handler for All Mongo Errors
	mongoose.Model.MongoErrors = function(errs) {
		var data = [];
		var counter = 0;
		for (var label in errs.errors) {
			console.log(errs)
			const msg = errs.errors[label].properties.message;
	    data[counter] = {label: msg};
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
			const gridfs = new Grid(mongoose.connection.db);
			api.set('gridfs', gridfs);
			// Setup Mongoose Model for GridFS for Other Models to reference.
			const GFS = require('../models/GridFSModel');
	  }
	});
}
