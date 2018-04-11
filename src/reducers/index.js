import auth from './auth';
import { combineReducers } from 'redux';
import common from './common';
import home from './home';
// import profile from './profile';
// import settings from './settings';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  auth,
  common,
  home,
  // profile,
  // settings,
  router: routerReducer
});
