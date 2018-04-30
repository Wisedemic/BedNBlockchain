/* Express Router */
const express = require('express');
const bookings = express.Router();

/* Necessary Models */
const Bookings = require('../models/BookingsModel').BookingsModel;
const Rooms = require('../models/RoomsModel').RoomsModel;

/* Helpers */
const helpers = require('../config/helpers.js');

// Add a new booking
bookings.put('/add', helpers.validateToken, function(req, res, next) {
	// Define a schema safe object
	const bookingData = {
    ownerId: req.body.ownerId,
    roomId: req.body.roomId,
    buyerId: req.body.buyerId,
    price: req.body.price,
    guests: req.body.guests
	};

	// Create a booking
	Bookings.create(bookingData, function(err, booking) {
  	console.log(err, booking);
  	if (err || !booking) return res.json({success: false, message: Bookings.MongoErrors(err)});
		if (booking) {

			// Quick update the Room booked to have a {booked: true} status.
      Rooms.findByIdAndUpdate(
        bookingData.roomId,
        {$set: {booked: true}},
        {new: true, runValidators: true}
      ).exec(function(err, room) {
      	if (err || !booking) return res.json({success: false, message: Bookings.MongoErrors(err)});
    		if (booking) {
					// If we Successfully updated the room, then save our booking.
					booking.save(function(err) {
    				if (err) res.send('Idk');
    				const payload = {
    					success: true,
    	        booking: booking
    	      };
    	      res.send({payload});
    			});
        }
      });
    }
  });
});

// Edit a booking
bookings.post('/edit/:bookingId', helpers.validateToken, function(req, res, next) {
  console.log(req.params);
  if (!req.params.bookingId) return res.json({error: true, errors: ['No RoomID Provided!']});
  if (req.params.bookingId) {
    const bookingData = {
      ownerId: req.body.ownerId,
      roomId: req.body.roomId,
      buyerId: req.body.buyerId,
      price: req.body.price,
      guests: req.body.guests
  	};
    console.log('before update', req.params.bookingId)
    Bookings.findByIdAndUpdate(
			req.params.bookingId,
			{$set: bookingData},
			{new: true, runValidators: true}
		).exec(function(err, booking) {
      if (err || !booking) return res.json({success: false, message: Bookings.MongoErrors(err)});
    	if (booking) {
        const payload = {
	        booking: booking
	      };
	      res.send({payload});
      }
    });
  }
});

// Retrieve a booking by ID
bookings.get('/:bookingId', function(req, res, next) {
  if (!req.params.bookingId) return res.json('A bookingId is required!');
  if (req.params.bookingId) {
    Bookings.findOne({_id: req.params.bookingId})
    .populate('ownerId').populate('buyerId').populate('roomId')
		.exec(function(err, booking) {
      console.log(err, booking);
      if (err || !booking) return res.json({success: false, message: Bookings.MongoErrors(err)});
			if (booking) {
				const payload = {
					id: booking._id,
					ownerId: booking.ownerId,
          roomId: booking.roomId,
          buyerId: booking.buyerId,
          price: booking.price,
					guests: booking.guests,
					updated_at: booking.updated_at,
					created_at: booking.created_at
				};
				return res.json({payload: {booking: payload}});
      }
    });
  }
});

// Get bookings by the room's Owner's ID (a User)
bookings.get('/ownerId/:ownerId', function(req, res, next) {
	if (!req.params.ownerId) return res.json('An ownerId is required!');
	if (req.params.ownerId) {
		Bookings.find({ownerId: req.params.ownerId})
		// .populate('featuredImageId').populate('ownerId')
		.exec(function(err, bookings) {
			console.log(err, bookings)
      if (err || !booking) return res.json({success: false, message: Bookings.MongoErrors(err)});
      if (bookings) {
				const payload = bookings.map((booking, index) => {
					return {
						id: booking._id,
						ownerId: booking.ownerId,
						featuredImageId: booking.featuredImageId,
						title: booking.title,
						description: booking.description,
						propertyType: booking.propertyType,
						bookingType: booking.bookingType,
						location: booking.location,
						price: booking.price,
						guests: booking.guests,
						updated_at: booking.updated_at,
						created_at: booking.created_at
					};
				});
        return res.json({payload: {bookings: payload}});
      }
		});
	}
});

// Get a booking by buyerID (User)
bookings.get('/buyerId/:buyerId', function(req, res, next) {
	if (!req.params.ownerId) return res.json('An buyerId is required!');
	if (req.params.ownerId) {
		Bookings.find({buyerId: req.params.buyerId})
		// .populate('featuredImageId').populate('ownerId')
		.exec(function(err, bookings) {
			console.log(err, bookings)
      if (err || !booking) return res.json({success: false, message: Bookings.MongoErrors(err)});
      } else if (bookings) {
				const payload = bookings.map((booking, index) => {
					return {
						id: booking._id,
						ownerId: booking.ownerId,
						featuredImageId: booking.featuredImageId,
						title: booking.title,
						description: booking.description,
						propertyType: booking.propertyType,
						bookingType: booking.bookingType,
						location: booking.location,
						price: booking.price,
						guests: booking.guests,
						updated_at: booking.updated_at,
						created_at: booking.created_at
					};
				});
        return res.json({payload: {bookings: payload}});
      }
		});
	}
});

// Delete a booking
bookings.delete('/delete/:bookingId', helpers.validateToken, function(req, res, next) {
  if (!req.params.bookingId) return res.json('A bookingId is required!');
  if (req.params.bookingId) {
    Bookings.deleteOne({_id: req.params.bookingId})
		.exec(function(err) {
      console.log(err);
      if (err) return res.json({success: false, message: Bookings.MongoErrors(err)});
      if (!err) {
        console.log('Deleted', req.params.bookingId);
				return res.status(200).send({payload: {error: false}});
      }
    });
  }
});

module.exports = bookings;
