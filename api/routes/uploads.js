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
		};

		// Finish this request
		res.send({payload: {file: payload}});
  });

	// write data to our write stream
	writeStream.write(req.file.buffer, () => {
    writeStream.end();
  });

	// Send our request back into our writeStream
	req.pipe(writeStream);
});

// Fetch a file
uploads.get('/:fileId', function(req, res, next) {
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
		});//open

		readStream.on('data', function(chunk) {
			chunks.push(chunk);
		  console.log('Retrieving chunks...', chunk);
		}); //loading

		readStream.on("end", function() {
		  console.log("File ready!");
			// Create a single buffer from the array of chunks.
			const buff = Buffer.concat(chunks);

			// convert to base64 string
			const base64 = buff.toString('base64');
			let file = 'data:' + fileMeta.contentType + ';base64,' + base64;
			// console.log(file);

			// End this request
			res.end(file);
		});

		readStream.on('error', function (err) {
	    console.log(err);
		});
		// Pipe the request back into our readStream
		readStream.pipe(res);
	});
});

module.exports = uploads;
