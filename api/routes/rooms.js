/* Express Router */
const express = require('express');
const rooms = express.Router();

/* Necessary Models */
const Rooms = require('../models/RoomsModel').RoomsModel;

/* Helpers */
const helpers = require('../config/helpers.js');

// Return all rooms in collection.
rooms.get('/all', function(req, res, next) {
	// Grab all rooms
  Rooms.find({})
	// .populate('featuredImageId').populate('ownerId')
	.exec(function(err, rooms) {
		// Throw errors
		if (err || !rooms) return res.json({errors: true, errors: Rooms.MongoErrors(err)});

		// If we recieved a valid Room array
		if (rooms) {
			const payload = rooms.map((room, index) => {
				return {
					id: room._id,
					ownerId: room.ownerId,
					featuredImageId: room.featuredImageId,
					title: room.title,
					description: room.description,
					propertyType: room.propertyType,
					roomType: room.roomType,
					location: room.location,
					price: room.price,
					guests: room.guests,
          booked: room.booked,
					updated_at: room.updated_at,
					created_at: room.created_at
				};
			});
			return res.json({payload: {rooms: payload}});
    }
  });
});

// Add A Room
rooms.put('/add', helpers.validateToken, function(req, res, next) {
	// Define a schema safe object
	const roomData = {
    ownerId: req.body.ownerId,
		featuredImageId: req.body.featuredImageId,
		title: req.body.title,
		description: req.body.desc,
    propertyType: req.body.propertyType,
    roomType: req.body.roomType,
    location: req.body.location,
    price: req.body.price,
    guests: req.body.guests
	};

	// Create the room
	Rooms.create(roomData, function(err, room) {
		if (err || !room) return res.json({errors: true, errors: Rooms.MongoErrors(err)});
 		if (room) {
			room.save(function(err) {
				if (err) res.send('Idk');
				const payload = {
					success: true,
	        room: room
	      };
	      res.send({payload});
			})
    }
  });
});

// Check Token for current Users request.
rooms.post('/edit/:roomId', helpers.validateToken, function(req, res, next) {
  console.log(req.params);
  if (!req.params.roomId) return res.json({error: true, errors: ['No RoomID Provided!']});
  if (req.params.roomId) {
		// Define a schema safe object
    const roomData = {
  		featuredImageId: req.body.featuredImageId,
  		title: req.body.title,
  		description: req.body.desc,
      propertyType: req.body.propertyType,
      roomType: req.body.roomType,
      location: req.body.location,
      price: req.body.price,
      guests: req.body.guests
  	};
    console.log('before update', req.params.roomId);
    Rooms.findByIdAndUpdate(req.params.roomId, {$set: roomData}, {new: true, runValidators: true}, function(err, room) {
      if (err || !room) return res.json({error: true, errors: Rooms.MongoErrors(err)});
    	if (room) {
        const payload = {
	        room: room
	      };
	      res.send({payload});
      }
    });
  }
});

// Find room by param ID
rooms.get('/:roomId', function(req, res, next) {
  if (!req.params.roomId) return res.json('A roomId is required!');
  if (req.params.roomId) {
    Rooms.findOne({_id: req.params.roomId})
    .populate('ownerId')
		.exec(function(err, room) {
      console.log(err, room);
      if (err || !room) return res.json({error: true, errors: Rooms.MongoErrors(err)});
      if (room) {
				const payload = {room: {
					id: room._id,
					ownerId: room.ownerId,
					featuredImageId: room.featuredImageId,
					title: room.title,
					description: room.description,
					propertyType: room.propertyType,
					roomType: room.roomType,
					location: room.location,
					price: room.price,
					guests: room.guests,
          booked: room.booked,
					updated_at: room.updated_at,
					created_at: room.created_at
				}};
				return res.json({payload});
      }
    });
  }
});

// Get Rooms by the owner's ID
rooms.get('/ownerId/:ownerId', function(req, res, next) {
	if (!req.params.ownerId) return res.json('An ownerId is required!');
	if (req.params.ownerId) {
		Rooms.find({ownerId: req.params.ownerId})
		// .populate('featuredImageId').populate('ownerId')
		.exec(function(err, rooms) {
			console.log(err, rooms)
			if (err || !rooms) return res.json({error: true, errors: Rooms.MongoErrors(err)});
      if (rooms) {
				const payload = rooms.map((room, index) => {
					return {
						id: room._id,
						ownerId: room.ownerId,
						featuredImageId: room.featuredImageId,
						title: room.title,
						description: room.description,
						propertyType: room.propertyType,
						roomType: room.roomType,
						location: room.location,
						price: room.price,
						guests: room.guests,
            booked: room.booked,
						updated_at: room.updated_at,
						created_at: room.created_at
					};
				});
        return res.json({payload: {rooms: payload}});
      }
		});
	}
});

// Delete a room by ID
rooms.delete('/delete/:roomId', helpers.validateToken, function(req, res, next) {
  if (!req.params.roomId) return res.json('A roomId is required!');
  if (req.params.roomId) {
    Rooms.deleteOne({_id: req.params.roomId})
		.exec(function(err) {
      console.log(err);
      if (err) return res.json({error: true, errors: Rooms.MongoErrors(err)});
      if (!err) {
        console.log('Deleted', req.params.roomId);
				return res.status(200).send({payload: {error: false}});
      }
    });
  }
});

// Export router
module.exports = rooms;
