/* Express Router */
let express = require('express');
let uploads = express.Router();

/* Upload Parsing Libs*/
let multer = require('multer');
let upload = multer({ storage: multer.memoryStorage() });

/* Necessary Models */
const Users = require('../models/UserModel').UserModel;

const moment = require('moment');

/* Helpers */
const helpers = require('../config/helpers.js');
uploads.use(helpers.validateToken);

// Upload a file
uploads.post('/', upload.single('file'), function(req, res, next) {
	console.log(req.file);
	if (!req.file) return res.send({error: true, errors: ['File uploaded failed to be retrieved by the server.']});
	const gridfs = req.app.get('gridfs');

	let writeStream = gridfs.createWriteStream({
      filename: (req.file.originalname)
  });
	writeStream.on('close', function (file) {
		const payload = {
			file_id: file._id,
			file_name: file.filename
		};
		  res.send({payload: {file: payload}});
  });
	req.pipe(writeStream);
});

// // Fetch a file
// uploads.get('/:fileId', function(req, res, next) {
// 	const gridfs = req.app.get('gridfs');
//
// 	gridfs.findOne({_id: req.params.fileId}, function (err, file) {
// 		if (err) return res.status(400).send(err);
// 		if (!file) return res.status(404).send('');
// 		console.log(file._id);
// 		res.set('Content-Type', file.contentType);
// 		res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
//
// 		var readstream = gfs.createReadStream({
// 			_id: file._id
// 		});
//
// 		readstream.on("error", function(err) {
// 			console.log("Got error while processing stream " + err.message);
// 			res.end();
// 		});
//
// 		readstream.pipe(res);
// 	});
// });

module.exports = uploads;
