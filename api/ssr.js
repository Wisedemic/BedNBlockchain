import React from 'react';
import { renderToStaticMarkup  } from 'react-dom/server';

// Global state binding for React
import { Provider } from 'react-redux';

// Router Components
import { Router, Route, Switch } from 'react-router';

import createMemoryHistory from 'history/createMemoryHistory';
import setupStore from 'client/store';

// Application View Component
import App from 'client/containers/App';
import template from 'client/index.html';

// Export page render as a function
export default () => {
  const history = createMemoryHistory();
  const store = setupStore(history);
  const state = store.getState();

  const rendered = renderToStaticMarkup(
    <Provider store={store}>
      <Router history={history}>
        <Route component={App} />
      </Router>
    </Provider>
  );
  const page = template
    .replace('<!-- CONTENT -->', rendered)
    .replace('"-- STORES --"', JSON.stringify(state));

  return page;
}
