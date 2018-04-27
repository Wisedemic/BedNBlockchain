/* Express Router */
const express = require('express');
const rooms = express.Router();

/* Necessary Models */
const Rooms = require('../models/RoomsModel').RoomsModel;

/* Helpers */
const helpers = require('../config/helpers.js');
rooms.use(helpers.validateToken);

// Check Token for current Users request.
rooms.get('/all', function(req, res, next) {
  Rooms.find({}).populate('featuredImageId').populate('ownerId').exec(function(err, rooms) {
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
					updated_at: room.updated_at,
					created_at: room.created_at
				};
			});
			return res.json({payload: {rooms: payload}});
    }
  });
});

// Check Token for current Users request.
rooms.post('/add', function(req, res, next) {
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
	if (!roomData.title) return res.send('A title is required!');
	if (!roomData.description) return res.send('A description is required!');
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

rooms.get('/:roomId', function(req, res, next) {
  // if (!req.parmas.roomId) return res.json('A roomId is required!');
  if (req.params.roomId) {
    Rooms.find({id: req.params.roomId}).populate('featuredImageId').populate('ownerId').exec(function(err, room) {
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
		Rooms.find({ownerId: req.params.ownerId}).populate('featuredImageId').populate('ownerId').exec(function(err, rooms) {
			console.log(err, rooms)
			if (err) {
        return res.json('why');
      } else if (!rooms) {
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

module.exports = rooms;
