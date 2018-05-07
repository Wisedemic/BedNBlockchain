import {
  ASYNC,
  LOAD_PAGE,
  UNLOAD_PAGE,
  ROOMS
} from '../actions';

const defaultState = {
  reload: false,
  roomsList: [],
  currentRoomInView: null,
  yourRooms: [],
  errors: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_PAGE.ROOM:
      return {
        ...state,
        reload: false,
        currentRoomInView: action.payload.room
      };
    case LOAD_PAGE.HOME:
    case LOAD_PAGE.ROOMS:
      return {
        ...state,
        reload: false,
        currentRoomInView: null,
        roomsList: action.payload.rooms ? action.payload.rooms : []
      };
    case LOAD_PAGE.YOURROOMS:
      return {
        ...state,
        reload: false,
				currentRoomInView: null,
        yourRooms: action.payload.rooms ? action.payload.rooms : []
      };

    case ASYNC.START:
      if (action.subtype === ROOMS.DELETE) {
        return {...state,
          loading: true
        };
      }
      return state;
    case ASYNC.END:
      return {...state,
        loading: false
      };
    case ROOMS.DELETE:
    case ROOMS.BOOK:
      return {...state,
        reload: action.payload.error ? false : true,
        errors: action.payload.error ? action.payload.errors : null
      };
    case UNLOAD_PAGE.ROOMS:
    case UNLOAD_PAGE.ROOM:
    case UNLOAD_PAGE.YOURROOMS:
      return state;
    default:
      return state;
  }
};
