/* Express Router */
var express = require('express');
var rooms = express.Router();

/* Necessary Models */
var Rooms = require('../models/RoomsModel').RoomsModel;

rooms.get('/:roomId', function(req, res, next) {
  console.log(req.params.roomId);
  if (req.params.roomId) {
    Rooms.find({id:req.params.roomId}, function(err, room) {
      console.log(err, room);
      if (err) {
        return res.json('why');
      } else if (!room) {
        return res.json('idk');
      } else if (room) {
        return res.json({payload: {room: {}}});
      } else {
        return res.json('huh?');
      }
    });
  } else {
      return res.json('A roomId is required!');
  }
});


// Check Token for current Users request.
rooms.get('/all', function(req, res, next) {
  Rooms.find({}, function(err, rooms) {
    console.log(err, rooms);
    if (err || !rooms) {
      res.send('WOOPS');
    } else {
      const payload = {
        rooms: rooms
      };
      res.send({payload});
    }
  });
});


// Check Token for current Users request.
rooms.post('/add', function(req, res, next) {
	const roomData = {
		title: req.body.title,
		description: req.body.desc
	};
	console.log(roomData);
	if (!roomData.title) return res.send('A title is required!');
	if (!roomData.description) return res.send('A description is required!');
	Rooms.create(roomData, function(err, room) {
    console.log(err, room);
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

module.exports = rooms;
