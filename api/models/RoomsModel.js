/* Requires */
var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// Define User Schema
var RoomsSchema = new Schema({
  title: { type: String, required: [true, 'A title is required!']},
  booked: Boolean,
  // price: {},
  // owner_id: {//mongoose model.id schema},
  // image: {},
  description: { type: String },
  location: {
    lat: Number,
    lng: Number,
  },
  availability: {
    start: Date,
    end: Date
  },
  created_at: Date,
	updated_at: Date
});

// Export Models
exports.RoomsModel = mongoose.model('Rooms', RoomsSchema);
