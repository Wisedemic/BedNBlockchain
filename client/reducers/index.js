import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import common from './common';
import home from './home';
import rooms from './rooms';
import roomEditor from './roomEditor';
import bookings from './bookings';
// import profile from './profile';
// import settings from './settings';

export default combineReducers({
  auth,
  common,
  home,
  rooms,
  roomEditor,
	bookings,
  // profile,
  // settings,
  router: routerReducer
});
