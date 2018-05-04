import {
  APP_LOAD,
	HANDLE_AJAX_ERROR,
	CONNECTION_ERROR,
  REDIRECT,
	LOGIN,
	SIGNUP,
	LOGOUT,
  ADD_ROOM
} from '../actions';

const defaultState = {
  appName: "Bed'N'Blockchain",
  token: null,
  viewChangeCounter: 0,
	errors: [],
  search: {
    loading: false,
    value: '',
    results: []
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
		case CONNECTION_ERROR:
			return {
				...state,
				errors: action.errors || []
			};
		case HANDLE_AJAX_ERROR:
			if (action.subtype === APP_LOAD) {
				return {
					...state,
					token: null,
					appLoaded: true,
					currentUser: null,
					errors: action.errors
				};
			}
      return {...state};
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
				errors: action.error ? action.errors : []
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
		case LOGOUT:
			return { ...state, redirectTo: '/', token: null, currentUser: null };
    case ADD_ROOM:
      return {...state,
        redirectTo: action.error ? null : '/your-rooms'
      };
    case LOGIN:
    case SIGNUP:
      return {
        ...state,
        redirectTo: action.error ? null : '/bookings',
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user
      };
    default:
      return state;
  }
};
