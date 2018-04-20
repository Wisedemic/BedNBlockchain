import {
  ROOMS_PAGE_LOADED,
  ROOMS_PAGE_UNLOADED,
  ROOM_PAGE_LOADED,
  ROOM_PAGE_UNLOADED,
  YOURROOMS_PAGE_LOADED,
  YOURROOMS_PAGE_UNLOADED,
  ROOM_FIELD_ERROR,
  UPDATE_ROOM_AUTH
} from '../actions';

const defaultInputState = {
  value: '',
  message: '',
  inputState: '',
  valid: false
};

const defaultState = {
  roomsList: [],
  currentRoomInView: null,
  yourRooms: [],
  addRoom: {
    title: {...defaultInputState},
    desc: {...defaultInputState}
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ROOM_PAGE_LOADED:
      return {
        ...state,
        currentRoom: action.payload.room
      }
    case ROOMS_PAGE_LOADED:
      return {
        ...state,
        list: action.payload.rooms ? action.payload.rooms : []
      };
    case YOURROOMS_PAGE_LOADED:
      return {
        ...state,
        yourRooms: action.payload.rooms ? action.payload.rooms : []
      };
    case ROOM_FIELD_ERROR:
      return {...state,
        addRoom: [action.key]: {
          message: action.message,
          inputState: action.inputState,
          value: action.value,
          valid: false
        }
      };
    case UPDATE_ROOM_AUTH:
      return {...state,
        addRoom: {[action.key]: {
          value: action.value,
          inputState: '',
          message: '',
          valid: true
        }}
      };
    case ROOMS_PAGE_UNLOADED:
    case ROOM_PAGE_UNLOADED:
    case YOURROOMS_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
