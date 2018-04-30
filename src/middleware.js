// Grab Requests Agent so we can add the users token if found.
import agent from './agent';

// Actions
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  SIGNUP,
  HANDLE_AJAX_ERROR
} from './actions';

// Allow an action to a Promise
const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });
    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      res => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return;
        }
        console.log('RESULT', res);

				// Grab a known payload if it exists.
        action.payload = (res.payload || res.body);

				// Tell the app the request finished.
        store.dispatch({ type: ASYNC_END, promise: action.payload });

				// Send an error to react/redux.
        if (res.error) {
          action.errors = res.errors;
          store.dispatch({ type: HANDLE_AJAX_ERROR, subtype: action.type, errors: action.errors });
        } else {
					// continue to next action
          store.dispatch(action);
        }
      },
      error => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response.body;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

// Ensure the user's token was removed on logout, and added on login.
const localStorageMiddleware = store => next => action => {
  if (action.type === SIGNUP || action.type === LOGIN) {
    if (!action.error) {
			console.log('token middleware time', action);
      window.localStorage.setItem('jwt', action.payload.user.token);
			action.token = action.payload.user.token;
      agent.setToken(action.payload.user.token);
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}

export { promiseMiddleware, localStorageMiddleware }
