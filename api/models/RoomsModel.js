/* Requires */
const mongoose = require('mongoose');
const validators = require('mongoose-validators');
const Schema = mongoose.Schema;

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
  ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  title: {type: String, required: [true, 'A title is required!']},
  description: {type: String, required: [true, 'A description is required!']},
  propertyType: {type: String, required: [true, 'A Property Type is required!']},
  roomType: {type: String, required: [true, 'A Room Type is required!']},
  location: {
    formatted_address: {type: String, required: [true, 'A formatted address is required!']},
    lat: {type: Number, required: [true, 'A latitude is required!']},
    lng: {type: Number, required: [true, 'A longtitude is required!']}
  },
  price: {type: Number, required: [true, 'A price is required!']},
  guests: {
    adults: {type: Number, required: [true, 'Number of adult guests is required!']},
    children: {type: Number, required: [true, 'Number of children guests is required!']}
  },
  features: String,
  booked: {type: Boolean, default: false},
  availability: {
    start: Date,
    end: Date
  },
	featuredImageId: {type: mongoose.Schema.Types.ObjectId, ref: 'GridFS'},
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
