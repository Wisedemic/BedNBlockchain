// Generate Random String.
const uuidv4 = require('uuid/v4');
const secret = require('./config.js').secret;
const jwt = require('jsonwebtoken');

// Token Expiry default
const expiresDefault = '1d';

// Validation middleware to check for a token in the req.header.
function validateToken(req, res, next) {
  // Ensure a token was provided.
  if (!req.headers.authorization) {
    console.log('[REQUEST VERIFICATION] -- Bad request headers!', req.headers);
    res.json({error: true, errors: ['This request did not have a valid token!']});
  } else if(!req.headers.authorization.split(' ')[0] === 'Token') {
    console.log('[REQUEST VERIFICATION] -- Missing Token in auth header!', req.headers);
    res.json({error: true, errors: ['This request did not have a valid token!']});
  } else {

    // Parse token from string
    let token = req.headers.authorization.split(' ')[1];
    // Verify the token
    if (verify(token)) {
      console.log('[REQUEST VERIFICATION] -- Token verified!');
      next(); // pass to next middleware
    } else {
      console.log('[REQUEST VERIFICATION] -- Token verification failed! Session destoryed!');
      // Destroy passport session.
      req.logout();
      req.session.destroy();
      // Tell the user what happened.
  		res.json({error: true, errors: ['Invalid Token']});
    }
  }
}

// create JWT
function generateToken(req, GUID, opts) {
  opts = opts || {};
  const token = jwt.sign({
    auth:  GUID,
    agent: req.headers['user-agent']
  }, secret, { expiresIn: opts.expires || expiresDefault });
	console.log('[REQUEST VERIFICATION] -- token generated: ', token);
  return token;
}

// Store the token in the user's metaData.
function generateAndStoreToken(req, user, opts) {
  const GUID   = uuidv4(); // Generate UUIDv4.
  const token  = generateToken(req, GUID, opts); // Generate Token

	// Define a schema friendly object for the user.
	const record = {
    key: token,
    valid: true,
    created_at: new Date().getTime()
  };

 	// Save token to user.
	user.set('token', record);
  user.save(function (err, user) {
		console.log('[REQUEST VERIFICATION] -- Token saved to user!');
    if (err || !user) return err;
		if (user) {

		}
  });
	// Return token
	return record.key;
}

// Token verifier
function verify(token) {
  let decoded = false;

	// Attempt to decode our token and verify.
	try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    decoded = false; // still false
  }

	// Did we decode properly?
  return decoded;
}

// Exports
module.exports = {
  verify : verify,
  generateAndStoreToken: generateAndStoreToken,
  validateToken: validateToken
}
