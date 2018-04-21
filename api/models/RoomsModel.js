/* Requires */
var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// Define User Schema
var RoomsSchema = new Schema({
  title: { type: String, required: [true, 'A title is required!']},
  description: { type: String, require: [true, 'A description is required!']},
  features: String,
  booked: Boolean,
  numGuests: Number,
  price: Number,
  location: {
    lat: Number,
    lng: Number,
  },
  availability: {
    start: Date,
    end: Date
  },
  // banner: {},
  // gallery: [],
  created_at: Date,
	updated_at: Date

});


// Before a user is saved into the Database
RoomsSchema.pre('save', function(next) {

	// Grab the user during this request
  var room = this;

	console.log(room);

	// change the updated_at field to current date
	var currentDate = new Date();
	room.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!room.created_at) room.created_at = currentDate;

	next();
});


// Export Models
exports.RoomsModel = mongoose.model('Rooms', RoomsSchema);
