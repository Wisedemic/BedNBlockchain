/* Express Router */
const express = require('express');
const bookings = express.Router();

/* Necessary Models */
const Bookings = require('../models/BookingsModel').BookingsModel;

/* Helpers */
const helpers = require('../config/helpers.js');

// Check Token for current Users request.
bookings.get('/all', function(req, res, next) {
  Bookings.find({})
	// .populate('featuredImageId').populate('ownerId')
	.exec(function(err, bookings) {
    if (err || !bookings) {
      res.send('WOOPS');
    } else {
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
});

// Check Token for current Users request.
bookings.put('/add', helpers.validateToken, function(req, res, next) {
  const bookingData = {
    ownerId: req.body.ownerId,
    roomId: req.body.roomId,
    buyerId: req.body.buyerId,
    price: req.body.price,
    guests: req.body.guests
	};
	Bookings.create(bookingData, function(err, booking) {
    console.log(err, booking);
   if (err || !booking) {
      res.send('WOOPS');
    } else {
			booking.save(function(err) {
				if (err) res.send('Idk');
				const payload = {
					success: true,
	        booking: booking
	      };
	      res.send({payload});
			})
    }
  });
});

// Check Token for current Users request.
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
    Bookings.findByIdAndUpdate(req.params.bookingId, {$set: bookingData}, {new: true, runValidators: true}, function(err, booking) {
      if (err || !booking) return res.json({success: false, message: Customers.MongoErrors(err)})
    	if (booking) {
        const payload = {
	        booking: booking
	      };
	      res.send({payload});
      }
    });
  } else {
    return res.json({error: true, errors: ['No bookingId Provided!']});
  }
});

bookings.get('/:bookingId', function(req, res, next) {
  if (!req.params.bookingId) return res.json('A bookingId is required!');
  if (req.params.bookingId) {
    Bookings.findOne({_id: req.params.bookingId})
    .populate('ownerId').populate('buyerId').populate('roomId')
		.exec(function(err, booking) {
      console.log(err, booking);
      if (err) {
        return res.json('why');
      } else if (!booking) {
        return res.json('idk');
      } else if (booking) {
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
      } else {
        return res.json('huh?');
      }
    });
  }
});

bookings.get('/ownerId/:ownerId', function(req, res, next) {
	if (!req.params.ownerId) return res.json('An ownerId is required!');
	if (req.params.ownerId) {
		Bookings.find({ownerId: req.params.ownerId})
		// .populate('featuredImageId').populate('ownerId')
		.exec(function(err, bookings) {
			console.log(err, bookings)
			if (err) {
        return res.json('why');
      } else if (!bookings) {
        return res.json('idk');
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
      } else {
        return res.json('huh?');
      }
		});
	}
});

bookings.delete('/delete/:bookingId', helpers.validateToken, function(req, res, next) {
  if (!req.params.bookingId) return res.json('A bookingId is required!');
  if (req.params.bookingId) {
    Bookings.deleteOne({_id: req.params.bookingId})
		.exec(function(err) {
      console.log(err);
      if (err) return res.json('why');
      if (!err) {
        console.log('Deleted', req.params.bookingId);
				return res.status(200).send({payload: {error: false}});
      } else {
        return res.json('huh?');
      }
    });
  }
});

module.exports = bookings;
