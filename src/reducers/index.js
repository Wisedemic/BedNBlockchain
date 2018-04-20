import auth from './auth';
import { combineReducers } from 'redux';
import common from './common';
import home from './home';
import rooms from './rooms';
import addRoom from './addRoom';
// import profile from './profile';
// import settings from './settings';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  auth,
  common,
  home,
  rooms,
  addRoom,
  // profile,
  // settings,
  router: routerReducer
});
