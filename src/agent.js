import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3001/api';

// const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

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

const Rooms = {
  all: () => requests.get('/rooms/all'),
	add: (title, desc) => requests.post('/rooms/add', {title, desc}),
  getRoom: (id) => requests.get('/rooms/'+id)
}

export default {
  Auth,
  Rooms,
  setToken: _token => { token = _token; }
};
