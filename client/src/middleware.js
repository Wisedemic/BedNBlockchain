// Grab Requests Agent so we can add the users token if found.
import agent from './agent';

// Actions
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  SIGNUP,
  HANDLE_AJAX_ERROR,
	CONNECTION_ERROR
} from './actions';

// Allow an action to a Promise
const promiseMiddleware = store => next => action => {
	// If the action has a payload that is a promise.
  if (isPromise(action.payload)) {
		// Tell react that we started an ASYNC action with it's subtype.
    store.dispatch({ type: ASYNC_START, subtype: action.type });
    const currentView = store.getState().viewChangeCounter;

		// Check if the action requested to skipTracking
    const skipTracking = action.skipTracking;

		// Await the response from the promise
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
        store.dispatch({ type: ASYNC_END, subtype: action.type, promise: action.payload });

				// Send an error to react/redux.
        if (res.error) {
        	action.error = true;
          action.errors = res.errors;
          store.dispatch({ type: HANDLE_AJAX_ERROR, subtype: action.type, errors: action.errors });
        } else {
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
				action.errors = ['A connection error occured! If this continues, please report it!'];
				action.payload = {error: action.error, errors: action.errors};
				store.dispatch({ type: ASYNC_END, subtype: action.type, promise: action.payload });
        store.dispatch({ type: CONNECTION_ERROR, errors: action.errors });
      }
    );
	} else {
		next(action);
	}
};

// Ensure the user's token was removed on logout, and added on login.
const localStorageMiddleware = store => next => action => {
	if (action.type === SIGNUP || action.type === LOGIN) {
    if (!action.error) {
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
