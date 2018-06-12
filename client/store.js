import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux'
import { drizzleSagas } from 'drizzle';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects'

import { promiseMiddleware, localStorageMiddleware, drizzleMiddleware } from './middleware';
import reducers from './reducers/';

console.log(drizzleSagas);

const rootSaga = function*() {
  yield all(drizzleSagas.map(saga => fork(saga)));
};

let _store = null;
// Setter
function setStore(store) {
  _store = store;
}

// Getter
export const getStore = () => {
  return _store;
};

// Init store
export const setupStore = (history) => {
  let store = null;
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [
    routerMiddleware(history),
		promiseMiddleware,
		localStorageMiddleware,
    sagaMiddleware
  ];

  if (process.env.NODE_ENV === 'development') {
    const { composeWithDevTools } = require('redux-devtools-extension');
		const { createLogger } = require('redux-logger');
    const enhancer = composeWithDevTools(applyMiddleware(...middleware, createLogger()));
    store = createStore(reducers, enhancer);

    if (module.hot) {
      module.hot.accept('./reducers/', () => {
        const nextRootReducer = require('./reducers/').default;
        store.replaceReducer(nextRootReducer);
      });
    }

    setStore(store);
    sagaMiddleware.run(rootSaga);
    return store;
  }

  sagaMiddleware.run(rootSaga);
  store = applyMiddleware(...middleware)(createStore)(reducers);
  setStore(store);

  return store;
};
