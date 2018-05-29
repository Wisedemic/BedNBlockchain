// Page Loaders
export const LOAD_PAGE = {
  HOME: 'LOAD_HOME_PAGE',
  LOGIN: 'LOAD_LOGIN_PAGE',
  SIGNUP: 'LOAD_SIGNUP_PAGE',
  ROOM: 'LOAD_ROOM_PAGE',
  ROOMS: 'LOAD_ROOMS_PAGE',
  ROOMEDITOR: 'LOAD_ROOMEDITOR_PAGE',
  YOURROOMS: 'LOAD_YOURROOMS_PAGE',
  BOOKINGS: 'LOAD_BOOKINGS_PAGE',
  SETTINGS: 'LOAD_SETTINGS_PAGE'
};

// Page Unloaders
export const UNLOAD_PAGE = {
  HOME: 'UNLOAD_HOME_PAGE',
  LOGIN: 'UNLOAD_LOGIN_PAGE',
  SIGNUP: 'UNLOAD_SIGNUP_PAGE',
  ROOM: 'UNLOAD_ROOM_PAGE',
  ROOMS: 'UNLOAD_ROOMS_PAGE',
  ROOMEDITOR: 'UNLOAD_ROOMEDITOR_PAGE',
  YOURROOMS: 'UNLOAD_YOURROOMS_PAGE',
  BOOKINGS: 'UNLOAD_BOOKINGS_PAGE',
  SETTINGS: 'UNLOAD_SETTINGS_PAGE'
};

// App general
export const APP = {
  LOAD: 'APP_LOAD',
  REDIRECT: 'REDIRECT',
  CLOSE_ERROR: 'GLOBAL_CLOSE_ERROR',
  DELETE_TOKEN: 'DELETE_TOKEN'
};

// Async related
export const ASYNC = {
  START: 'ASYNC_START',
  END: 'ASYNC_END',
  ERROR: 'ASYNC_ERROR',
  CONNECTION_ERROR: 'ASYNC_CONNECTION_ERROR'
};

// Authentication related
export const AUTH = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  LOGOUT: 'LOGOUT',
  FIELD_ERROR: 'AUTH_FIELD_ERROR',
  UPDATE_FIELD: 'AUTH_UPDATE_FIELD',
  CLOSE_ERROR: 'AUTH_CLOSE_ERROR',
  FieldError: (key, message, inputState, value) => {
    return {
      type: AUTH.FIELD_ERROR,
      key,
      message,
      inputState,
      value
    };
  }
};

// Room related
export const ROOMS = {
  CLOSE_ERROR: 'ROOMS_CLOSE_ERROR',
  FIELD_ERROR: 'ROOMS_FIELD_ERROR',
  INCREMENT_GUESTS: 'ROOMS_INCREMENT_GUESTS',
  DECREMENT_GUESTS: 'ROOMS_DECREMENT_GUESTS',
	SELECT_DATES: 'ROOMS_SELECT_DATES',
	UPDATE_CALENDAR_TYPE: 'ROOMS_UPDATE_CALENDAR_TYPE',
  ADD: 'ADD_ROOM',
  EDIT: 'EDIT_ROOM',
  BOOK: 'BOOK_ROOM',
  DELETE: 'DELETE_ROOM',
  FieldError: (key, message, inputState, value) => {
    return {
      type: ROOMS.FIELD_ERROR,
      key,
      message,
      inputState,
      value
    };
  }
};

// Booking related
export const BOOKINGS = {
  ADD: 'ADD_BOOKING',
  EDIT: 'EDIT_BOOKING',
  DELETE: 'DELETE_BOOKING'
};

// RoomEditor related
export const ROOMEDITOR = {
  CLOSE_ERROR: 'SETTINGS_CLOSE_ERROR',
  FIELD_ERROR: 'ROOMEDITOR_FIELD_ERROR',
  UPDATE_FIELD: 'ROOMEDITOR_UPDATE_FIELD',
  INCREMENT_GUESTS: 'ROOMEDITOR_INCREMENT_GUESTS',
  DECREMENT_GUESTS: 'ROOMEDITOR_DECREMENT_GUESTS',
  UPLOAD_FEATURED_IMAGE: 'ROOMEDITOR_UPLOAD_FEATURED_IMAGE',
  FETCH_GMAPS_RESULTS: 'ROOMEDITOR_FETCH_GMAPS_RESULTS',
  UPDATE_LOCATION_FROM_SUGGESTION: 'ROOMEDITOR_UPDATE_LOCATION_FROM_SUGGESTION',
	SELECT_DATE_TYPE: 'ROOMEDITOR_SELECT_DATE_TYPE',
  FieldError: (key, message, inputState, value) => {
    return {
      type: ROOMEDITOR.FIELD_ERROR,
      key,
      message,
      inputState,
      value
    };
  }
};

// Setings related
export const SETTINGS = {
  UPDATE_FIELD: 'SETTINGS_UPDATE_FIELD',
  FIELD_ERROR: 'SETTINGS_FIELD_ERROR',
  CLOSE_ERROR: 'SETTINGS_CLOSE_ERROR',
  FieldError: (key, message, inputState, value) => {
    return {
      type: SETTINGS.FIELD_ERROR,
      key,
      message,
      inputState,
      value
    };
  }
};