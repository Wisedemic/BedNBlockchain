import {
  ASYNC_START,
  ASYNC_END,
  HOME_PAGE_LOADED,
  ROOMS_PAGE_LOADED,
  ROOMS_PAGE_UNLOADED,
  ROOM_PAGE_LOADED,
  ROOM_PAGE_UNLOADED,
  YOURROOMS_PAGE_LOADED,
  YOURROOMS_PAGE_UNLOADED,
  DELETE_ROOM,
  BOOK_ROOM
} from '../actions';

const defaultState = {
  reload: false,
  roomsList: [],
  currentRoomInView: null,
  yourRooms: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        roomsList: action.payload.rooms ? action.payload.rooms : []
      };
    case ROOM_PAGE_LOADED:
      return {
        ...state,
        reload: false,
        currentRoomInView: action.payload.room
      };
    case ROOMS_PAGE_LOADED:
      return {
        ...state,
        reload: false,
        currentRoomInView: null,
        roomsList: action.payload.rooms ? action.payload.rooms : []
      };
    case YOURROOMS_PAGE_LOADED:
      return {
        ...state,
        reload: false,
				currentRoomInView: null,
        yourRooms: action.payload.rooms ? action.payload.rooms : []
      };

    case ASYNC_START:
      if (action.subtype === DELETE_ROOM) {
        return {...state,
          loading: true
        };
      }
      return state;
    case ASYNC_END:
      return {...state,
        loading: false
      };
    case DELETE_ROOM:
    case BOOK_ROOM:
      return {...state,
        reload: action.payload.error ? false : true,
        errors: action.payload.error ? action.payload.errors : null
      };
    case ROOMS_PAGE_UNLOADED:
    case ROOM_PAGE_UNLOADED:
    case YOURROOMS_PAGE_UNLOADED:
      return state;
    default:
      return state;
  }
};
