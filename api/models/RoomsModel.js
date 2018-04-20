/* Requires */
var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// Define User Schema
var RoomsSchema = new Schema({
  title: { type: String, required: [true, 'A title is required!']},
  description: String,
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

// Export Models
exports.RoomsModel = mongoose.model('Rooms', RoomsSchema);
