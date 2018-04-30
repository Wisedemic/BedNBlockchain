/* Requires */
const mongoose = require('mongoose');
const validators = require('mongoose-validators');
const Schema = mongoose.Schema;

// Define User Schema
const BookingsSchema = new Schema({
  ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: [true, 'An ownerId is required!']},
  roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Rooms', required: [true, 'A roomId is required!']},
  buyerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: [true, 'A buyerId is required!']},
  price: {type: Number, required: [true, 'A price is required!']},
  guests: {
    adults: {type: Number, required: [true, 'Number of adult guests is required!']},
    children: {type: Number, required: [true, 'Number of children guests is required!']}
  },
	created_at: Date,
	updated_at: Date
});

// Before a user is saved into the Database
BookingsSchema.pre('save', function(next) {

	// Grab the user during this request
  const booking = this;

	console.log(booking);

	// change the updated_at field to current date
	const currentDate = new Date();
	booking.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!booking.created_at) booking.created_at = currentDate;

	next();
});

// Export Models
exports.BookingsModel = mongoose.model('Bookings', BookingsSchema);
