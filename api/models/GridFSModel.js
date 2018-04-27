const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.UserModel = mongoose.model("GridFS", new Schema({}, {strict: false}), "fs.files" );
