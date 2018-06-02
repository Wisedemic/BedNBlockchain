/* Requires */
import React from 'react';
import { render } from 'react-dom';

// Global React + Redux State & History
import setupStore from './store';
import createHistory from 'history/createBrowserHistory';

// Global State Binding for React
import { Provider } from 'react-redux';

// Router Components
import { Router, Route, Switch } from 'react-router';

// Application View Component
import App from './containers/App';

const history = createHistory();
const store = setupStore(history);

const renderToPage = Component => {
  render(
		<Provider store={store}>
	    <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
	      <Switch>
	        <Route path="/" component={Component} />
	      </Switch>
	    </Router>
	  </Provider>,
	document.getElementById('root'));
};

renderToPage(App);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./containers/App', () => {
    const HotApp = require('./containers/App').default;
    renderToPage(HotApp);
  });
}
