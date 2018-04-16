import {
  LOGIN,
  SIGNUP,
  ASYNC_START,
  ASYNC_END ,
  UPDATE_FIELD_AUTH,
  FIELD_ERROR,
  CLOSE_ERROR,
  HANDLE_AJAX_ERROR
} from '../actions';

const defaultInputState = {
  value: '',
  message: '',
  inputState: '',
  valid: false
}

const defaultState = {
  email: {...defaultInputState},
  password: {...defaultInputState},
  passwordConfirm: {...defaultInputState},
  inProgress: false,
  errors: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOGIN:
    case SIGNUP:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case ASYNC_START:
      if (action.subtype === LOGIN || action.subtype === SIGNUP) {
        return {...state, inProgress: true, errors: null};
      }
      break;
    case ASYNC_END:
      if (action.subtype === LOGIN || action.subtype === SIGNUP) {
        return {...state, inProgress: false};
      }
      break;
    case CLOSE_ERROR:
      return {...state, errors: null};
    case FIELD_ERROR:
      return {...state,
        [action.key]: {
          message: action.message,
          inputState: action.inputState,
          value: action.value,
          valid: false
        }
      };
    case UPDATE_FIELD_AUTH:
      return { ...state,
        [action.key]: {
          value: action.value,
          inputState: '',
          message: '',
          valid: true
        }
      };
    case HANDLE_AJAX_ERROR:
      return {...state, inProgress: false, errors: action.payload.errors};
    default:
      return defaultState;
  }
  return state;
};
