/* DB Config */
const mongoose = require('mongoose');
const config = require('./config.js');

// Define Error Handler for All Mongo Errors
mongoose.Model.MongoErrors = function(errs) {
	var data = [];
	var counter = 0;
	for (var key in errs.errors) {
		console.log(errs.errors[key]);
	    data[counter] = {el: '#'+errs.errors[key].path, error: errs.errors[key].properties.message};
		counter++;
	}
	console.log(data);
	return data;
}

// Connect to MongoDB
mongoose.connect(config.mongoURL, function (err, res) {
    if (err) {
        console.log('[DB] Connection to "' + config.mongoURL + '" failed!. ' + err);
    } else {
        console.log('[DB] Successfully connected to MongoDB Server');
    }
});
