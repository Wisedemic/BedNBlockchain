import {
	ADD_ROOM,
	EDIT_ROOM,
  ROOMEDITOR_PAGE_LOADED,
  ROOMEDITOR_PAGE_UNLOADED,
  ROOMEDITOR_FIELD_ERROR,
  UPDATE_ROOMEDITOR_FIELD
} from '../actions';

const defaultInputState = {
  value: '',
  message: '',
  inputState: '',
  valid: false
};

const defaultState = {
	mode: 'edit',
  title: {...defaultInputState},
  desc: {...defaultInputState}
};

export default (state = defaultState, action) => {
  switch (action.type) {
		case ADD_ROOM:
		case EDIT_ROOM:
			return {
				...state
			};
    case ROOMEDITOR_PAGE_LOADED:
      return {
        ...state,
        mode: action.mode
      };
    case ROOMEDITOR_FIELD_ERROR:
      return { ...state,
        [action.key]: {
          value: action.value,
          inputState: action.inputState,
          message: action.message,
          valid: false
        }
      };
    case UPDATE_ROOMEDITOR_FIELD:
      return { ...state,
        [action.key]: {
          value: action.value,
          inputState: '',
          message: '',
          valid: true
        }
      };
    case ROOMEDITOR_PAGE_UNLOADED:
      return defaultState;
    default:
      return state;
  }
};
