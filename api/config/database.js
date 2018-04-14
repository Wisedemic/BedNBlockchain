/* DB Config */
const mongoose = require('mongoose');
const config = require('./config.js');

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
    if (err) {
        console.log('[DB] Connection to MongoDB failed!. ' + err);
    } else {
        console.log('[DB] Successfully connected to MongoDB Server');
    }
});
