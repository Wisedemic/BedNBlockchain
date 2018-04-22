/* Requires */
const mongoose = require('mongoose');
const validators = require('mongoose-validators');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const HomeTypes = [
  'Entire Place',
  'Private Room',
  'Shared Room'
];

const PropertyTypes = [
  'House',
  'Bed and Breakfast',
  'Bungalow',
  'Chalet',
  'Cottage',
  'Guesthouse',
  'Guest suite',
  'Hotel',
  'Resort',
  'Loft',
  'Townhouse',
  'Villa'
];

// Define User Schema
const RoomsSchema = new Schema({
  title: {type: String, required: [true, 'A title is required!']},
  description: {type: String, required: [true, 'A description is required!']},
  homeType: {type: String, required: [true, 'A Room Type is required!']},
  propertyType: {type: String, required: [true, 'A Property Type is required!']},
  features: String,
  booked: Boolean,
  numGuests: Number,
  guests: {
    adults: Number,
    children: Number
  },
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
  const room = this;

	console.log(room);

	// change the updated_at field to current date
	const currentDate = new Date();
	room.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!room.created_at) room.created_at = currentDate;

	next();
});

// Export Models
exports.RoomsModel = mongoose.model('Rooms', RoomsSchema);
