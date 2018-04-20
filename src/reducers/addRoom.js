import {
  ADD_ROOM_PAGE_LOADED,
  ADD_ROOM_PAGE_UNLOADED,
  ADD_ROOM_FIELD_ERROR,
  UPDATE_ADD_ROOM_FIELD
} from '../actions';

const defaultInputState = {
  value: '',
  message: '',
  inputState: '',
  valid: false
};

const defaultState = {
  title: {...defaultInputState},
  desc: {...defaultInputState}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ADD_ROOM_PAGE_UNLOADED:
      return {...state};
    case ADD_ROOM_PAGE_LOADED:
      return {
        ...state,
        addRoom: defaultState
      };
    case ADD_ROOM_FIELD_ERROR:
      return { ...state,
        [action.key]: {
          value: action.value,
          inputState: action.inputState,
          message: action.message,
          valid: false
        }
      };
    case UPDATE_ADD_ROOM_FIELD:
      return { ...state,
        [action.key]: {
          value: action.value,
          inputState: '',
          message: '',
          valid: true
        }
      };
    case ADD_ROOM_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
