/* Requires */
import React from 'react';
import { render } from 'react-dom';

// Global React + Redux State & History
import setupStore from './store';
import createHistory from 'history/createBrowserHistory';

// Router Components
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

// Global State Binding for React
import { Provider } from 'react-redux';

// Application View Component
import App from './containers/App';

const history = createHistory();
const store = setupStore(history);

const renderToPage = Component => {
  render(
		<Provider store={store}>
	    <ConnectedRouter history={history} onUpdate={() => window.scrollTo(0, 0)}>
	      <Switch>
	        <Route path="/" component={App} />
	      </Switch>
	    </ConnectedRouter>
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

console.log('Version:', window.CONFIG.VERSION);
