import {
  APP,
  ASYNC,
  AUTH,
  ROOMS
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
		case APP.CLOSE_ERROR:
		  return {
				...state,
				errors: state.errors.filter((item, index) => action.index !== index)
			};
		case ASYNC.CONNECTION_ERROR:
			return {
				...state,
				errors: action.errors || []
			};
		case ASYNC.ERROR:
			if (action.subtype === APP.LOAD) {
				return {
					...state,
					token: null,
					appLoaded: true,
					currentUser: null,
					errors: action.errors
				};
			}
      return {...state};
    case APP.LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
				errors: action.error ? action.errors : []
      };
    case APP.REDIRECT:
      return { ...state, redirectTo: null };
		case AUTH.LOGOUT:
			return { ...state, redirectTo: '/', token: null, currentUser: null };
    case ROOMS.ADD:
      return {...state,
        redirectTo: action.error ? null : '/your-rooms'
      };
    case AUTH.LOGIN:
    case AUTH.SIGNUP:
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
