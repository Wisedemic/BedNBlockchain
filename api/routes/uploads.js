/* Express Router */
const express = require('express');
const uploads = express.Router();

/* Upload Parsing Libs*/
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Upload a file
uploads.post('/', upload.single('image'), function(req, res) {
	console.log(req.files, req.file);
	const gridfs = req.app.get('gridfs');
  var writeStream = gridfs.createWriteStream({
      filename: 'file_name_here'
  });
  writeStream.on('close', function (file) {
      res.send(`File has been uploaded ${file._id}`);
  });
  req.pipe(writeStream);
});

// Fetch a file
uploads.get('/:filename', function(req, res) {
	const gridfs = req.app.get('gridfs');
  gridfs.createReadStream({
      _id: req.params.fileId // or provide filename: 'file_name_here'
  }).pipe(res);
});

module.exports = uploads;
