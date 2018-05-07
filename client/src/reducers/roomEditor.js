import {
	ASYNC,
	LOAD_PAGE,
	UNLOAD_PAGE,
	ROOMEDITOR,
	ROOMS
} from '../actions';

const defaultInputState = {
  value: '',
  message: '',
  inputState: '',
  valid: false
};

const defaultState = {
	mode: 'add',
	message: '',
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
		case ROOMS.ADD:
			return {...state,
				inProgress: false,
				errors: action.error ? action.payload.errors : null
			};

		case ROOMS.EDIT:
			return {...state,
				inProgress: false,
				errors: action.error ? action.payload.errors : null,
				message: 'Room Updated Successfully!'
			};
    case LOAD_PAGE.ROOMEDITOR:
			if (action.mode === 'edit') {
				return {
	        ...state,
	        mode: 'edit',
					title: {...state.title,
						value: action.payload.room.title,
						valid: true
					},
					desc: {...state.desc,
						value: action.payload.room.description,
						valid: true
					},
					propertyType: {...state.propertyType,
						value: action.payload.room.propertyType,
						valid: true
					},
					roomType: {...state.roomType,
						value: action.payload.room.roomType,
						valid: true
					},
					location: {...state.location,
						value: action.payload.room.location,
						valid: true
					},
					price: {...state.price,
						value: action.payload.room.price,
						valid: true
					},
					guests: {...state.guests,
						value: action.payload.room.guests,
						valid: true
					},
					featuredImage: {...state.featuredImage,
						value: {...state.featuredImage.value,
							file_id: action.payload.room.featuredImageId
						},
						valid: true
					}

	      };
			} else {
				return {
	        ...state,
	        mode: 'add'
	      };
			}
		case ROOMEDITOR.INCREMENT_GUESTS:
			return {...state,
				guests: {...state.guests,
					value: {...state.guests.value,
						[action.guestType]: ++state.guests.value[action.guestType]
					}
				}
			};
		case ROOMEDITOR.DECREMENT_GUESTS:
			return {...state,
				guests: {...state.guests,
					value: {...state.guests.value,
						[action.guestType]: (state.guests.value[action.guestType] <= 0 ? 0 : --state.guests.value[action.guestType])
					}
				}
			};
		case ROOMEDITOR.FIELD_ERROR:
      return { ...state,
        [action.key]: {
          value: action.value,
          inputState: action.inputState,
          message: action.message,
          valid: false
        }
      };
    case ROOMEDITOR.UPDATE_FIELD:
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
		case ROOMEDITOR.FETCH_GMAPS_RESULTS:
			return { ...state,
				location: {...state.location,
					results: action.payload.results
				}
			};
		case ROOMEDITOR.UPDATE_LOCATION_FROM_SUGGESTION:
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
		case ROOMEDITOR.UPLOAD_FEATURED_IMAGE:
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

		case ASYNC.START:
			if (action.subtype === ROOMEDITOR.FETCH_GMAPS_RESULTS) {
				return { ...state,
					location: {...state.location,
						loading: true
					}
				};
			} else if (action.subtype === ROOMEDITOR.UPLOAD_FEATURED_IMAGE) {
				return {...state,
					featuredImage: {...state.featuredImage,
						loading: true,
						message: 'Uploading...'
					}
				};
			} else {
				return {...state};
			}
		case ASYNC.END:
			return { ...state,
				location: {...state.location,
					loading: false
				},
				featuredImage: {...state.featuredImage,
					loading: false
				}
			};
		case ASYNC.ERROR:
			if (action.subtype === ROOMEDITOR.FETCH_GMAPS_RESULTS) {
				return {...state,
					errors: action.errors
				};
			} else if (action.subtype === ROOMEDITOR.UPLOAD_FEATURED_IMAGE) {
				return {...state,
					errors: action.errors
				};
			} else {
				return state;
			}
	  case UNLOAD_PAGE.ROOMEDITOR:
      return defaultState;
    default:
      return state;
  }
};
