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
	console.log('req.file', req.file);
	if (!req.file) return res.send({error: true, errors: ['File uploaded failed to be retrieved by the server.']});
	const gridfs = req.app.get('gridfs');
	const filename = req.file.originalname.split('.')[0] + moment().format("YYYY-MM-DD-HHmmss") + req.file.originalname.split('.')[1];

	let writeStream = gridfs.createWriteStream({
    filename: filename,
		mode: 'w',
		content_type: req.file.mimetype
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

// Fetch a file
uploads.get('/:fileId', function(req, res, next) {
	const gridfs = req.app.get('gridfs');

	gridfs.findOne({
		_id: req.params.fileId
	}, function (err, file) {
		if (err) return res.status(400).send(err);
		if (!file) return res.status(404);

		const fileMeta = file;
		console.log('fileMeta', fileMeta);

		res.set('Content-Type', fileMeta.contentType);
		res.set('Content-Disposition', 'attachment; filename="' + fileMeta.filename + '"');

		let data = [];

		let readstream = gridfs.createReadStream({
			_id: fileMeta._id
		});

		readstream.on('data', function(chunk) {
			data.push(chunk);
			console.log('chunk', chunk);
		});

		readstream.on('end', function() {
			data = Buffer.concat(data);
			let file = 'data:'+fileMeta.contentType+';base64,'+Buffer(data).toString('base64');
			console.log(data);
			console.log(fileMeta);
			res.send(file);
		});
		readstream.on('error', function(err) {
			console.log(err);
			throw err;
		});
	});
});

module.exports = uploads;
