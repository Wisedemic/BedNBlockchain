/* Requires */
import React from 'react';
import ReactDOM from 'react-dom';

// Global React + Redux State & History
import { store, history } from './store';

// Router Components
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

// Global State Binding for React
import { Provider } from 'react-redux';

// Application View Component
import App from './containers/App';

// Render DOM with React + Redux + Routing.
ReactDOM.render((
  <Provider store={store}>
    <ConnectedRouter history={history} onUpdate={() => window.scrollTo(0, 0)}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>
), document.getElementById('root'));
