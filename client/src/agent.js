// Grab Superagent for handling outbound requests.
import _superagent from 'superagent';
import superagentPromise from 'superagent-promise';

// Promisifiy superagent
const superagent = superagentPromise(_superagent, global.Promise);

// Define constants
const API_ROOT = 'http://localhost:3001/api';
const GMAPS_ROOT = 'https://maps.googleapis.com/maps/api/geocode/';
// const encode = encodeURIComponent;
const responseBody = res => res.body;
let token = null;
let GMAPSKEY = 'AIzaSyAeUUJdV1tvsAu8J63PvZVFEQAKvg8thVI';

// Used to add a token to request headers.
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
};

// Define a general request handler to add the user's token if it exists.
const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

// Define general GMAPS requests for standardized calls to the API
const GMapsAPIRequest = {
	post: address =>
	superagent.post(`${GMAPS_ROOT}json?address=${address}&key=${GMAPSKEY}`),
	get: address =>
	superagent.get(`${GMAPS_ROOT}json?address=${address}&key=${GMAPSKEY}`)
};

// Authentication requests
const Auth = {
  current: () =>
    requests.get('/auth'),
  login: (email, password) =>
    requests.post('/auth/login', {email, password}),
  signup: (email, password, passwordConfirm) =>
    requests.post('/auth/signup', {email, password, passwordConfirm}),
  save: user =>
    requests.put('/user', {user})
};

// Handle requests to GMaps API
const Maps = {
	findAddress: (value) => {
		const json = encodeURIComponent(JSON.stringify(value));
		return GMapsAPIRequest.get(json);
	}
};

// Room Requests
const Rooms = {
  all: () => requests.get('/rooms/all'),
	add: (ownerId, title, desc, propertyType, roomType, location, price, guests, featuredImageId) => requests.put('/rooms/add', {ownerId, title, desc, propertyType, roomType, location, price, guests, featuredImageId}),
  editRoom: (roomId, title, desc, propertyType, roomType, location, price, guests, featuredImageId) => requests.post('/rooms/edit/'+ roomId, {title, desc, propertyType, roomType, location, price, guests, featuredImageId}),
  getRoom: (id) => requests.get('/rooms/'+id),
  roomByUserId: (id) => requests.get('/rooms/ownerId/'+id),
  bookRoom: (roomId, userId) => requests.post('/rooms/bookRoom/'+roomId, {userId}),
  deleteRoom: (id) => requests.del('/rooms/delete/'+id)
};

// Bookings Requests
const Bookings = {
  all: () => requests.get('/bookings/all'),
	bookRoom: (buyerId, ownerId, roomId, price, guests) => requests.put('/bookings/add', {buyerId, ownerId, roomId, price, guests}),
  editBooking: (bookingId, guests) => requests.post('/rooms/edit/'+ bookingId, {guests}),
  getBooking: (id) => requests.get('/bookings/'+id),
  bookingsByBuyerId: (buyerId) => requests.get('/bookings/buyerId/'+buyerId),
  deleteBooking: (bookingId) => requests.del('/bookings/delete/'+bookingId)
};

// Requests to the file server
const Uploads = {
	asyncFileUpload: (file) => {
    return superagent
      .post(`${API_ROOT}/uploads/`)
      .use(tokenPlugin)
      .send(file)
      .on('progress', event => {
        console.log(event);
      })
      .then(responseBody);
	},
	getFile: (id) => {
		return superagent
			.get(`${API_ROOT}/uploads/`+id)
			.use(tokenPlugin)
			.on('progress', event => {
				console.log(event);
			})
			.then(responseBody);
	}
};

// Exports
export default {
  Auth,
  Rooms,
  Bookings,
	Maps,
	Uploads,
  setToken: _token => { token = _token; }
};
