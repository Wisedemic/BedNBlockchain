import {
  AUTH,
  ASYNC,
  LOAD_PAGE,
  UNLOAD_PAGE
} from '../actions';

const defaultInputState = {
  value: '',
  message: '',
  inputState: '',
  valid: false
};

const defaultState = {
  email: {...defaultInputState},
  password: {...defaultInputState},
  passwordConfirm: {...defaultInputState},
  inProgress: false,
  errors: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
		case LOAD_PAGE.LOGIN:
		case LOAD_PAGE.SIGNUP:
			return defaultState;
    case AUTH.LOGIN:
    case AUTH.SIGNUP:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case ASYNC.START:
      if (action.subtype === AUTH.LOGIN || action.subtype === AUTH.SIGNUP) {
        return {...state, inProgress: true, errors: null};
      }
      break;
    case ASYNC.END:
      if (action.subtype === AUTH.LOGIN || action.subtype === AUTH.SIGNUP) {
        return {...state, inProgress: false};
      }
      break;
    case AUTH.CLOSE_ERROR:
      return {...state, errors: null};
    case AUTH.FIELD_ERROR:
      return {...state,
        [action.key]: {
          message: action.message,
          inputState: action.inputState,
          value: action.value,
          valid: false
        }
      };
    case AUTH.UPDATE_FIELD:
      return { ...state,
        [action.key]: {
          value: action.value,
          inputState: '',
          message: '',
          valid: true
        }
      };
    case ASYNC.ERROR:
      if (action.subtype === AUTH.SIGNUP || action.subtype === AUTH.LOGIN) {
        return {...state, errors: action.errors};
      }
      break;
		case UNLOAD_PAGE.LOGIN:
		case UNLOAD_PAGE.SIGNUP:
			return defaultState;
    default:
      return state;
  }
  return state;
};
