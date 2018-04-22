import {
  APP_LOAD,
  REDIRECT,
	LOGIN,
	SIGNUP,
	LOGOUT
} from '../actions';

const defaultState = {
  appName: "Bed'N'Blockchain",
  token: null,
  viewChangeCounter: 0
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
		case LOGOUT:
			return { ...state, redirectTo: '/', token: null, currentUser: null };
		case LOGIN:
    case SIGNUP:
      return {
        ...state,
        redirectTo: action.error ? null : '/bookings',
        token: action.error ? null : action.payload.user.token.key,
        currentUser: action.error ? null : action.payload.user
      };
    default:
      return state;
  }
};
