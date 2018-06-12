import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { drizzleReducers } from 'drizzle';

import auth from './auth';
import common from './common';
import home from './home';
import rooms from './rooms';
import roomEditor from './roomEditor';
import bookings from './bookings';

export default combineReducers({
  auth,
  common,
  home,
  rooms,
  roomEditor,
	bookings,
  router: routerReducer,
  ...drizzleReducers
});
