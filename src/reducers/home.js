import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED
} from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return state;
    case HOME_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
