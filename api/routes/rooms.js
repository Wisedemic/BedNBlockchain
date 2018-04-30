/* Express Router */
const express = require('express');
const rooms = express.Router();

/* Necessary Models */
const Rooms = require('../models/RoomsModel').RoomsModel;

/* Helpers */
const helpers = require('../config/helpers.js');

// Check Token for current Users request.
rooms.get('/all', function(req, res, next) {
  Rooms.find({})
	// .populate('featuredImageId').populate('ownerId')
	.exec(function(err, rooms) {
    if (err || !rooms) {
      res.send('WOOPS');
    } else {
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

// Check Token for current Users request.
rooms.put('/add', helpers.validateToken, function(req, res, next) {
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
	Rooms.create(roomData, function(err, room) {
   if (err || !room) {
      res.send('WOOPS');
    } else {
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
    console.log('before update', req.params.roomId)
    Rooms.findByIdAndUpdate(req.params.roomId, {$set: roomData}, {new: true, runValidators: true}, function(err, room) {
      if (err || !room) return res.json({success: false, message: Customers.MongoErrors(err)})
    	if (room) {
        const payload = {
	        room: room
	      };
	      res.send({payload});
      }
    });
  } else {
    return res.json({error: true, errors: ['No RoomID Provided!']});
  }
});

rooms.get('/:roomId', function(req, res, next) {
  if (!req.params.roomId) return res.json('A roomId is required!');
  if (req.params.roomId) {
    Rooms.findOne({_id: req.params.roomId})
    .populate('ownerId')
		.exec(function(err, room) {
      console.log(err, room);
      if (err) {
        return res.json('why');
      } else if (!room) {
        return res.json('idk');
      } else if (room) {
				const payload = {
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
				return res.json({payload: {room: payload}});
      } else {
        return res.json('huh?');
      }
    });
  }
});

rooms.get('/ownerId/:ownerId', function(req, res, next) {
	if (!req.params.ownerId) return res.json('An ownerId is required!');
	if (req.params.ownerId) {
		Rooms.find({ownerId: req.params.ownerId})
		// .populate('featuredImageId').populate('ownerId')
		.exec(function(err, rooms) {
			console.log(err, rooms)
			if (err || !room) {
        return res.json('idk');
      } else if (rooms) {
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
      } else {
        return res.json('huh?');
      }
		});
	}
});

rooms.delete('/delete/:roomId', helpers.validateToken, function(req, res, next) {
  if (!req.params.roomId) return res.json('A roomId is required!');
  if (req.params.roomId) {
    Rooms.deleteOne({_id: req.params.roomId})
		.exec(function(err) {
      console.log(err);
      if (err) return res.json('why');
      if (!err) {
        console.log('Deleted', req.params.roomId);
				return res.status(200).send({payload: {error: false}});
      } else {
        return res.json('huh?');
      }
    });
  }
});

module.exports = rooms;
