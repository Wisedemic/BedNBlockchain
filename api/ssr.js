import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import createMemoryHistory from 'history/createMemoryHistory';
import { ConnectedRouter } from 'react-router-redux';

import setupStore from 'client/store';
// Application View Component
import App from 'client/containers/App';
import template from 'client/index.html';

export default () => {
  const history = createMemoryHistory();
  const store = setupStore(history);
  const state = store.getState();

  const rendered = renderToString(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route component={App} />
      </ConnectedRouter>
    </Provider>,
  );
  const page = template
    .replace('<!-- CONTENT -->', rendered)
    .replace('"-- STORES --"', JSON.stringify(state));

  return page;
}
