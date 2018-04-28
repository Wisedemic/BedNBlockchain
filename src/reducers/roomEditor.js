import {
	ASYNC_START,
	ASYNC_END,
	ADD_ROOM,
	EDIT_ROOM,
  ROOMEDITOR_PAGE_LOADED,
  ROOMEDITOR_PAGE_UNLOADED,
  ROOMEDITOR_FIELD_ERROR,
  UPDATE_ROOMEDITOR_FIELD,
	HANDLE_AJAX_ERROR,
	FETCH_GMAPS_RESULTS,
	UPDATE_LOCATION_FROM_SUGGESTION,
	INCREMENT_ROOMEDITOR_GUESTS,
	DECREMENT_ROOMEDITOR_GUESTS,
	UPLOAD_FEATURED_IMAGE
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
	roomType: {...defaultInputState},
	location: {...defaultInputState,
		loading: false,
		results: [],
		value: {lat: 0, lng: 0, formatted_address: ''}
	},
	price: {...defaultInputState},
	guests: {value: {adults: 0, children: 0}},
	featuredImage: {
		...defaultInputState,
		value: {
			file_id: '',
			image: '',
			file_name: ''
		},
		loading: false,
		message: '',
		inputState: '',
		valid: false
	}
};

export default (state = defaultState, action) => {
  switch (action.type) {
		case ADD_ROOM:
		case EDIT_ROOM:
			return {...state,
				inProgress: false,
				errors: action.error ? action.payload.errors : null
			};
    case ROOMEDITOR_PAGE_LOADED:
      return {
        ...state,
        mode: action.mode
      };
		case INCREMENT_ROOMEDITOR_GUESTS:
			return {...state,
				guests: {...state.guests,
					value: {...state.guests.value,
						[action.guestType]: ++state.guests.value[action.guestType]
					}
				}
			};
		case DECREMENT_ROOMEDITOR_GUESTS:
			return {...state,
				guests: {...state.guests,
					value: {...state.guests.value,
						[action.guestType]: (state.guests.value[action.guestType] <= 0 ? 0 : --state.guests.value[action.guestType])
					}
				}
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
		case FETCH_GMAPS_RESULTS:
			return { ...state,
				location: {...state.location,
					results: action.payload.results
				}
			};
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
		case UPLOAD_FEATURED_IMAGE:
			return {...state,
				featuredImage: {...state.featuredImage,
					value: {...state.featuredImage.value,
						file_id: action.payload.file.file_id,
						file_name: action.payload.file.file_name,
					},
					inputState: 'is-success',
					message: 'Upload Successful!',
					valid: true
				}
			};

		case ASYNC_START:
			if (action.subtype === FETCH_GMAPS_RESULTS) {
				return { ...state,
					location: {...state.location,
						loading: true
					}
				};
			} else if (action.subtype === UPLOAD_FEATURED_IMAGE) {
				return {...state,
					featuredImage: {...state.featuredImage,
						loading: true,
						message: 'Uploading...'
					}
				};
			} else {
				return {...state};
			}
		case ASYNC_END:
			return { ...state,
				location: {...state.location,
					loading: false
				},
				featuredImage: {...state.featuredImage,
					loading: false
				}
			};
		case HANDLE_AJAX_ERROR:
			if (action.subtype === FETCH_GMAPS_RESULTS) {
				return {...state,
					location: {...state.location,
						loading: false
					},
					errors: action.errors
				};
			} else if (action.subtype === UPLOAD_FEATURED_IMAGE) {
				return {...state,
					featuredImage: {...state.location,
						loading: false
					},
					errors: action.errors
				};
			} else {
				return state;
			}
	  case ROOMEDITOR_PAGE_UNLOADED:
      return defaultState;
    default:
      return state;
  }
};
