import React from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import Room from './pages/Room';
import YourRooms from './pages/YourRooms';
import RoomEditor from './pages/RoomEditor';
import Bookings from './pages/Bookings';
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
  onLoad: (payload, token) => {
	  dispatch({ type: APP_LOAD, payload, token, skipTracking: true })
	},
  onRedirect: () =>
    dispatch({ type: REDIRECT })
});

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
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
            <Route exact path="/rooms" component={Rooms} />
            <Route exact path="/room/:roomId" component={Room} />
            <Route exact path="/bookings" component={Bookings} />
            <Route exact path="/your-rooms" component={YourRooms} />
            <Route exact path="/your-rooms/add" component={RoomEditor} />
						<Route exact path="/your-rooms/edit" component={RoomEditor} />
            <Route component={Four_Oh_Four} />
          </Switch>
					<footer className="footer">
					  <div className="container has-text-centered">
							<nav className="level">
								<div className="level-item has-text-centered">
									<h4 className="subtitle is-4">Created By</h4>
									<br />
									<p>Tristan Navarrete</p>
									<a href="https://tristannavarrete.com/">{'https://tristannavarrete.com/'}</a>
									<a href="https://github.com/Wisedemic/"><i className="fa fa-github"></i></a>
								</div>
								<div className="level-item has-text-centered">
									<h4 className="subtitle is-4">Made With</h4>
									<br />
									<p className="content">
										React, Redux, Express.js, Mongoose.js, Passport.js, Bulma.io
									</p>
								</div>
							</nav>
						</div>
					</footer>
        </div>
      );
    }
    return (
      <div>
        <Header
          appName={this.props.appName}
          appLoaded={this.props.appLoaded}
          currentUser={this.props.currentUser} />
        <section id="loader" className="hero is-fullheight">
          <h2 className="title is-2">This will just take a moment...</h2>
          <img src={require('./assets/loader.gif')} alt="Loading..."/>
          <h2 className="subtitle is-2">Loading. . .</h2>
        </section>
      </div>
    );
  }
}

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);
