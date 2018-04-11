import {
  APP_LOAD,
  REDIRECT,
} from '../actions';

const defaultState = {
  appName: "Bed'N'Blockchain",
  token: null,
  viewChangeCounter: 0
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    default:
      return state;
  }
};
