import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3001/api';
const GMAPS_ROOT = 'https://maps.googleapis.com/maps/api/geocode/';
// const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
let GMAPSKEY = 'AIzaSyAeUUJdV1tvsAu8J63PvZVFEQAKvg8thVI';

const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
};

const GMapsAPIRequest = {
	post: address =>
		superagent.post(`${GMAPS_ROOT}json?address=${address}&key=${GMAPSKEY}`),
	get: address =>
		superagent.get(`${GMAPS_ROOT}json?address=${address}&key=${GMAPSKEY}`)
};

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

const Maps = {
	findAddress: (value) => {
		const json = encodeURIComponent(JSON.stringify(value));
		return GMapsAPIRequest.get(json);
	}
};

const Rooms = {
  all: () => requests.get('/rooms/all'),
	add: (ownerId, title, desc, propertyType, roomType, location, price, guests) => requests.post('/rooms/add', {ownerId, title, desc, propertyType, roomType, location, price, guests}),
  getRoom: (id) => requests.get('/rooms/'+id),
  roomByUserId: (id) => requests.get('/rooms/ownerId/'+id)
};

const Uploads = {
	asyncFileUpload: (file) =>
    superagent
      .post(`${API_ROOT}/uploads/`)
      // .use(tokenPlugin)
      .send(file)
      .on('progress', event => {
        console.log(event);
      })
      .end((err, res) => {
        console.log(err, res);
      })
};

export default {
  Auth,
  Rooms,
	Maps,
	Uploads,
  setToken: _token => { token = _token; }
};
