/* Express Router */
let express = require('express');
let uploads = express.Router();

/* Upload Parsing Libs*/
let multer = require('multer');
let upload = multer({ storage: multer.memoryStorage() });

/* Models */
const Users = require('../models/UserModel').UserModel;

/* Utilities */
const moment = require('moment');

/* Helpers */
const helpers = require('../config/helpers.js');

// Upload a file
uploads.post('/', helpers.validateToken, upload.single('file'), function(req, res, next) {
	console.log('req.file', req.file);
	if (!req.file) return res.send({error: true, errors: ['File uploaded failed to be retrieved by the server.']});

	// Grab GridFS for file parsing into MongoDB
	const gridfs = req.app.get('gridfs');

	// Define a filename that is unique.
	const filename = req.file.originalname.split('.')[0] + moment().format("YYYY-MM-DD-HHmmss") + req.file.originalname.split('.')[1];

	// Begin writing data from reqest into a writeStream
	let writeStream = gridfs.createWriteStream({
    filename: filename,
		mode: 'w',
		content_type: req.file.mimetype
	});

	writeStream.on('close', function (file) {
		console.log(file);
		// Send data back to the user
		const payload = {
			file_id: file._id,
			file_name: file.filename
		}; // Finished writing the file to gridfs.

		// Finish this request
		res.send({payload: {file: payload}});
  });

	// write current file buffer to our GridFS writeStream
	writeStream.write(req.file.buffer, () => {
    writeStream.end(); // On complete, end the stream.
  });

	// Loop until the stream ends.
	req.pipe(writeStream);
});

// Fetch a file
uploads.get('/:fileId', function(req, res, next) {
	// Grab GridFS for file parsing into MongoDB
	const gridfs = req.app.get('gridfs');

	// Find the requested file by it's ID
	gridfs.findOne({_id: req.params.fileId}, function (err, file) {
		if (err) return res.status(400).send(err);
		if (!file) return res.status(404);

		const fileMeta = file;

		// Begin Reading data from gridfs into a stream.
		let readStream = gridfs.createReadStream({
			_id: fileMeta._id
		});

		let chunks = [];

		readStream.on('open', function() {
	    console.log("Reading File from DB");
		}); // On stream start

		readStream.on('data', function(chunk) {
			chunks.push(chunk);
		  console.log('Retrieving chunks...', chunk);
		}); //loading

		readStream.on("end", function() {
		  console.log("File ready!");
			// Create a single buffer from the array of chunks(buffers).
			const buff = Buffer.concat(chunks);
			// Convert to base64 string
			const base64 = buff.toString('base64');
			// Return browser readable data
			let file = 'data:' + fileMeta.contentType + ';base64,' + base64;
			// End this request
			res.end(file);
		}); // On stream end.

		readStream.on('error', function (err) {
	    console.log(err);
		}); // Catch errors

		// Loop until the stream ends.
		readStream.pipe(res);
	});
});

// Export
module.exports = uploads;
