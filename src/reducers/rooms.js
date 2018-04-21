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
        currentRoom: action.payload.room
      }
    case ROOMS_PAGE_LOADED:
      return {
        ...state,
        roomsList: action.payload.rooms ? action.payload.rooms : []
      };
    case YOURROOMS_PAGE_LOADED:
      return {
        ...state,
        yourRooms: action.payload.rooms ? action.payload.rooms : []
      };
    case ROOMS_PAGE_UNLOADED:
    case ROOM_PAGE_UNLOADED:
    case YOURROOMS_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
