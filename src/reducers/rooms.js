import {
  ROOMS_PAGE_LOADED,
  ROOMS_PAGE_UNLOADED,
  ROOM_PAGE_LOADED,
  ROOM_PAGE_UNLOADED,
  YOURROOMS_PAGE_LOADED,
  YOURROOMS_PAGE_UNLOADED
} from '../actions';

const defaultState = {
  roomsList: [],
  currentRoomInView: null,
  yourRooms: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ROOM_PAGE_LOADED:
      return {
        ...state,
        currentRoomInView: action.payload.room
      }
    case ROOMS_PAGE_LOADED:
      return {
        ...state,
				currentRoomInView: null,
        roomsList: action.payload.rooms ? action.payload.rooms : []
      };
    case YOURROOMS_PAGE_LOADED:
      return {
        ...state,
				currentRoomInView: null,
        yourRooms: action.payload.rooms ? action.payload.rooms : []
      };
    case ROOMS_PAGE_UNLOADED:
    case ROOM_PAGE_UNLOADED:
    case YOURROOMS_PAGE_UNLOADED:
      return state;
    default:
      return state;
  }
};
