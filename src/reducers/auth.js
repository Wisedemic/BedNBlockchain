import {
  LOGIN,
  SIGNUP,
  LOGIN_PAGE_UNLOADED,
  SIGNUP_PAGE_UNLOADED,
  ASYNC_START,
  ASYNC_END ,
  UPDATE_FIELD_AUTH,
  FIELD_ERROR
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
    case LOGIN_PAGE_UNLOADED:
    case SIGNUP_PAGE_UNLOADED:
      return {};
    case ASYNC_START:
      if (action.subtype === LOGIN || action.subtype === SIGNUP) {
        return { ...state, inProgress: true };
      }
      break;
    case ASYNC_END:
      if (action.subtype === LOGIN || action.subtype === SIGNUP) {
        return {...state, inProgress: false};
      }
      break;
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
    default:
      return defaultState;
  }

  return state;
};
