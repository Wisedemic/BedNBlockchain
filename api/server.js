import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan'; // logger
import session from 'express-session';
import { connectMongoose } from './config/database.js';
import passport from './config/passport'; // User auth

import { PORT, SECRET, MONGO_DB_URI } from './constants';
import serverSideRender from './ssr';
import routes from './routes/';

// Setup Express API Server
const api = express();

// Setup MongoDB
connectMongoose(api);

// // Attach our mongodb to express session data
const MongoStore = require('connect-mongo')(session);

// Set Global Express vars
api.set('port', PORT);
api.set('secret', SECRET);

// Setup Session
api.use(session({
	maxAge: 100*60*60,
	secret: api.get('secret'),
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({url: MONGO_DB_URI})
}));
api.use(passport.initialize()); // Passport.js Init
api.use(passport.session()); // Session Init

// Request Body Parsing Middleware
api.use(bodyParser.urlencoded({ extended: true }));// Parse application/x-www-form-urlencoded
api.use(bodyParser.json()); // Parse application/json

// CORS Configuration is done here!
let corsOptions = {
  origin: [`http://localhost:${PORT}`],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
// Pass all routes through this middleware
api.all('*', cors(corsOptions), (req, res, next) => {
	req.accepts('application/json');
	console.log('-----------------------------');
	console.log('Path: ', req.path);
	console.log('Method: ', req.method);
	console.log('Params: ', req.params);
	console.log('Body: ', req.body);
	console.log('Headers: ', req.headers);
	console.log('-----------------------------');
	next();
});

/*
	Apply webpack Hot reloading middleware to
	listen to changes in our api server
	if we're in development mode.
*/
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {

  // Bind our webpack compiler to our express webpack Hot Middleware
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware-webpack-2');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('config/webpack.client.dev');
  const compiler = webpack(webpackConfig);

  api.use(webpackHotMiddleware(compiler));
  api.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));

  // Tell express where to find files while in development
  api.use(express.static(path.resolve('.build')));
  // Logging
  const morgan = require('morgan');
  api.use(morgan('dev'));

} else if (process.env.NODE_ENV === 'production') {
  // Tell express where to find files while in production1
	api.use(express.static(path.resolve('dist')));
}

// Grab all api routes after we've setup express
api.use(routes);

// And finally if no other route is matched,
// then send our react app.
api.get('/*', (req, res) => {
	console.log('iran');
  if (process.env.NODE_ENV === 'production') {
    const page = serverSideRender();
    return res.send(page);
  }
  const template = require('../client/index.html');
  const CONSTANT = require('../client/constants');
  const page = template.replace('"-- CONFIG --"', JSON.stringify(CONSTANT));
  return res.send(page);
});

export default api;
