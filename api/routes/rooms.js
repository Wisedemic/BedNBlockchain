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
      res.send({payload})
    }
  });
});

module.exports = rooms;
