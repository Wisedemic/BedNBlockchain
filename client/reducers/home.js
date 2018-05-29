import {
  LOAD_PAGE,
  UNLOAD_PAGE
} from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_PAGE.HOME:
      return state;
    case UNLOAD_PAGE.HOME:
      return {};
    default:
      return state;
  }
};
