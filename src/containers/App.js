import React from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Four_Oh_Four from '../components/404';

import { APP_LOAD, REDIRECT } from '../actions';
import agent from '../agent';

import { store } from '../store';
import { push } from 'react-router-redux';

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
  }
};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
});

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }
    this.props.onLoad(token ? agent.Auth.current() : null, token);
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div className="app">
          <Header
            appName={this.props.appName}
            currentUser={this.props.currentUser}
            appLoaded={this.props.appLoaded}
          />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route component={Four_Oh_Four} />
          </Switch>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          appLoaded={this.props.appLoaded}
          currentUser={this.props.currentUser} />
        <section id="loader" className="section">
          <img src={require('./assets/loader.gif')} alt="Loading..."/>
        </section>
      </div>
    );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);
