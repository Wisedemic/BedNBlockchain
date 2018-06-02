import {
  ASYNC,
  LOAD_PAGE,
  UNLOAD_PAGE,
  BOOKINGS
} from '../actions';

const defaultState = {
  reload: false,
	errors: null,
  yourBookings: [],
	loading: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_PAGE.BOOKINGS:
      return {
        ...state,
        reload: false,
        yourBookings: action.payload.bookings ? action.payload.bookings : []
      };
    case ASYNC.START:
      if (action.subtype === BOOKINGS.DELETE) {
        return {...state,
          loading: true
        };
      }
      return {...state};
    case ASYNC.END:
      return {...state,
        loading: false
      };
    case BOOKINGS.DELETE:
      return {...state,
        reload: action.payload.error ? false : true,
        errors: action.payload.error ? action.payload.errors : null
      };
    case UNLOAD_PAGE.BOOKINGS:
      return state;
    default:
      return state;
  }
};
