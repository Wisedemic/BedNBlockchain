import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import { SECRET } from '../constants';

// Token Expiry default
const expiresDefault = '1d';

// Validation middleware to check for a token in the req.header.
export function validateToken(req, res, next) {
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
export function generateToken(req, GUID, opts) {
  opts = opts || {};
  const token = jwt.sign({
    auth:  GUID,
    agent: req.headers['user-agent']
  }, SECRET, { expiresIn: opts.expires || expiresDefault });
	console.log('[REQUEST VERIFICATION] -- token generated: ', token);
  return token;
}

// Store the token in the user's metaData.
export function generateAndStoreToken(req, user, opts) {
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
export function verify(token) {
  let decoded = false;

	// Attempt to decode our token and verify.
	try {
    decoded = jwt.verify(token, SECRET);
  } catch (e) {
    decoded = false; // still false
  }

	// Did we decode properly?
  return decoded;
}
