/* Requires */
var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

/* Utilities */
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Define User Schema
var UserSchema = new Schema({
	token: {
		key: String,
		valid: {type: Boolean, select: false},
		created_at: {type: Date, select: false}
	},
	firstname:	{ type: String, trim: true },
	lastname:	{ type: String, trim: true },
	email:	{
		type: String,
		required: [true, 'An email is required!'],
		unique: [true, 'Email already taken!'],
		trim: true,
		lowercase: true,
		validate: [validators.isEmail({message: 'Invalid Email'})]
	},
	password:	{ type: String, required: true },
	salt: { type: String, select: false },
	avatar: {
		data: Buffer,
		contentType: String
	},
	admin: Boolean,
	meta: {
		age: Number,
		website: String
	},
	created_at: Date,
	updated_at: Date
});

// Before a user is saved into the Database
UserSchema.pre('save', function(next) {

	// Grab the user during this request
  var user = this;

	// change the updated_at field to current date
	var currentDate = new Date();
	user.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!user.created_at) user.created_at = currentDate;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

	  if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // Update the user's password and salt fields for database entry.
      user.password = hash;
      user.salt = salt;
      next();
  	});
	});
});

// Password Verification
UserSchema.methods.validPassword = function(candidatePassword, cb) {
	// Grab the user's Salt
	var salt = this.salt;
	// Grab the user's hashed password
	var password = this.password;

	// If we are going to return data to another server process
	if (cb && cb instanceof Function) {

		// Hash the Candiate Password to Compare against our salt.
		bcrypt.hash(candidatePassword, salt, function(err, candidateHash) {
			// Hashing Error
			if (err) return cb(err);

			// Comparison Check
			if (candidateHash === password) {
				cb(null, true); // True
			} else {
				cb(err, false); // False
			}
		});
	// Else, we just send a true/false.
	} else {

		// Generate a hash from the attempted password
		var hash = bcrypt.hashSync(candidatePassword, salt);

		// Comparison Check
		if (hash === password) {
			return true; // True
		} else {
			return false; // False
		}
	}
};

// Export Models
exports.UserModel = mongoose.model('Users', UserSchema);
