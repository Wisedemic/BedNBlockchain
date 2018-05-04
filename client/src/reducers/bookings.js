import {
  ASYNC_START,
  ASYNC_END,
  BOOKINGS_PAGE_LOADED,
  BOOKINGS_PAGE_UNLOADED,
  DELETE_BOOKING
} from '../actions';

const defaultState = {
  reload: false,
	errors: null,
  yourBookings: [],
	loading: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case BOOKINGS_PAGE_LOADED:
      return {
        ...state,
        reload: false,
        yourBookings: action.payload.bookings ? action.payload.bookings : []
      };
    case ASYNC_START:
      if (action.subtype === DELETE_BOOKING) {
        return {...state,
          loading: true
        };
      }
      return {...state};
    case ASYNC_END:
      return {...state,
        loading: false
      };
    case DELETE_BOOKING:
      return {...state,
        reload: action.payload.error ? false : true,
        errors: action.payload.error ? action.payload.errors : null
      };
    case BOOKINGS_PAGE_UNLOADED:
      return state;
    default:
      return state;
  }
};
