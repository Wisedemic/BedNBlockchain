/* Requires */
import React from 'react';
import { render } from 'react-dom';

// Global React + Redux State & History
import { setupStore } from './store';
import createHistory from 'history/createBrowserHistory';

// Router Components
import { Router, Route, Switch } from 'react-router';

// Drizzle tells our app to listen to the Ethereum network
// for our contracts! It updates automatically.
import { DrizzleProvider } from 'drizzle-react'
import drizzleOptions from './reducers/drizzleOptions';

// Global State Binding for React
import { Provider } from 'react-redux';

// Application View Component
import App from './containers/App';

// Setup Redus Global State Storage + History
const history = createHistory();
const store = setupStore(history);

const renderToPage = Component => {
  render(
    (<DrizzleProvider options={drizzleOptions} store={store}>
  		<Provider store={store}>
  	    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
  	      <Switch>
  	        <Route path="/" component={Component} />
  	      </Switch>
  	    </Router>
  	  </Provider>
    </DrizzleProvider>),
	document.getElementById('root'));
};

renderToPage(App);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./containers/App', () => {
    const HotApp = require('./containers/App').default;
    renderToPage(HotApp);
  });
}
