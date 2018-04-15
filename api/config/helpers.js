// Generate Random String.
const uuidv4 = require('uuid/v4');
const secret = require('./config.js').secret;
const jwt = require('jsonwebtoken');

var expiresDefault = '1d';

// Check for login function
function loggedIn(req, res, next) {
    if (req.user) {
        if (verify(req.user.token.key)) {
            next();
        } else {
            req.logout();
            req.session.destroy();
            res.redirect('/');
        }
    } else {
		res.redirect('/login');
	}
}

// create JWT
function generateToken(req, GUID, opts) {
    opts = opts || {};
    var token = jwt.sign({
        auth:  GUID,
        agent: req.headers['user-agent']
    }, secret, { expiresIn: opts.expires || expiresDefault });
    return token;
}

function generateAndStoreToken(req, user, opts) {
    var GUID   = uuidv4(); // Generate UUID.
    var token  = generateToken(req, GUID, opts);
    var record = {
        key: token,
        valid : true,
        created_at : new Date().getTime()
    }

    user.set('token', record);
    user.save(function (err, user) {
        if (err) return err;
    });
		
		return token;
}

function verify(token) {
    var decoded = false;
    try {
        decoded = jwt.verify(token, secret);
    } catch (e) {
        decoded = false; // still false
    }
    return decoded;
}

module.exports = {
    verify : verify,
    generateAndStoreToken: generateAndStoreToken,
    loggedIn: loggedIn
}
