import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux'
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducers from './reducers/';

export default function setupStore(history) {
  const middleware = [
    routerMiddleware(history),
		promiseMiddleware,
		localStorageMiddleware
  ];

  if (process.env.NODE_ENV === 'development') {
    const { composeWithDevTools } = require('redux-devtools-extension');
		const { createLogger } = require('redux-logger');
    const enhancer = composeWithDevTools(applyMiddleware(...middleware, createLogger()));
    const store = createStore(reducers, enhancer);

    if (module.hot) {
      module.hot.accept('./reducers/', () => {
        const nextRootReducer = require('./reducers/').default;
        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
  }

  return applyMiddleware(...middleware)(createStore)(reducers);
}
