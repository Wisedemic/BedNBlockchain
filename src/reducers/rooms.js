import {
  ROOMS_PAGE_LOADED,
  ROOMS_PAGE_UNLOADED,
  ROOM_PAGE_LOADED,
  ROOM_PAGE_UNLOADED
} from '../actions';
const defaultState = {
  list: [],
  currentRoom: null
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
    case ROOMS_PAGE_UNLOADED:
    case ROOM_PAGE_UNLOADED:
      return {};

    default:
      return state;
  }
};
