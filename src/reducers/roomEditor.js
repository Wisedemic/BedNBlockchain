import {
	ASYNC_START,
	ASYNC_END,
	ADD_ROOM,
	EDIT_ROOM,
  ROOMEDITOR_PAGE_LOADED,
  ROOMEDITOR_PAGE_UNLOADED,
  ROOMEDITOR_FIELD_ERROR,
  UPDATE_ROOMEDITOR_FIELD,
	FETCH_GMAPS_RESULTS,
	UPDATE_LOCATION_FROM_SUGGESTION
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
  desc: {...defaultInputState},
  propertyType: {...defaultInputState},
	homeType: {...defaultInputState},
	location: {...defaultInputState,
		loading: false,
		results: [],
		value: {lat: 0, lng: 0, formatted_address: ''}
	},
	price: {...defaultInputState},
	guests: {...defaultInputState, value: {adults: 0, children: 0, infants: 0}}
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
			if (action.key === 'location') {
				return { ...state,
	        location: {...state.location,
	          value: {...state.location.value, formatted_address: action.value},
	          inputState: '',
	          message: '',
	          valid: true
	        }
	      };
			} else {
				return { ...state,
	        [action.key]: {
	          value: action.value,
	          inputState: '',
	          message: '',
	          valid: true
	        }
	      };
			}
		case UPDATE_LOCATION_FROM_SUGGESTION:
			return {
				...state,
				location: {...state.location,
					results: [],
					value: {
						formatted_address: action.value.formatted_address,
						lat: action.value.lat,
						lng: action.value.lng,
					}
				}
			};
		case FETCH_GMAPS_RESULTS:
			return { ...state,
				location: {...state.location,
					results: action.payload.results
				}
			};
		case ASYNC_START:
			if (action.subtype === FETCH_GMAPS_RESULTS) {
				return { ...state,
					location: {...state.location,
						loading: true
					}
				};
			}
			return {...state};
		case ASYNC_END:
			return { ...state,
				location: {...state.location,
					loading: false
				}
			};
	  case ROOMEDITOR_PAGE_UNLOADED:
      return defaultState;
    default:
      return state;
  }
};
