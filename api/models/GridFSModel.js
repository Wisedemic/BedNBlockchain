/* Requires */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Export Models
exports.GridFSModel = mongoose.model("GridFS", new Schema({}, {strict: false}), "fs.files" );
