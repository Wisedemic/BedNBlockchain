// React
import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { AnimatedSwitch, spring } from 'react-router-transition';

// Components
import Header from './Header';
import GlobalErrors from '../components/GlobalErrors';

// Routes
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import Room from './pages/Room';
import YourRooms from './pages/YourRooms';
import RoomEditor from './pages/RoomEditor';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import Four_Oh_Four from '../components/404';
import Loading from '../components/Loading';

// styles
import Bulma from '../styles/Bulma.scss';
import styles from '../styles/styles.scss';

// Actions
import { APP } from '../actions';

// HTTP Request agent
import agent from '../agent';

// Location and State history
// import { store } from '../store';
import { push } from 'react-router-redux';

// Assign Global State to Props
const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
		errors: state.common.errors
  }
};

// Assign Redux Actions to Props
const mapDispatchToProps = dispatch => ({
	closeError: (index) => dispatch({ type: APP.CLOSE_ERROR, index: index }),
	onRedirect: () => dispatch({ type: APP.REDIRECT }),
  onLoad: (payload, token) => {
	  dispatch({ type: APP.LOAD, payload, token, skipTracking: true })
	}
});

/*
* 	Application Wrapper component.
* 	This is the first component to render a view for bednblockchain.
*/
class App extends React.Component {
	componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  componentDidMount() {
		const localStorage = require('web-storage')().localStorage;
		const token = localStorage.get('jwt');
    // If there was a token
    if (token) {
      // Tell our request agent to use it for all requests.
      agent.setToken(token);
    }
    // Fetch the user from the server and load the app.
    this.props.onLoad(token ? agent.Auth.current() : null, token);

  }

  render() {
    // wrap the `spring` helper to use a bouncy config
    const bounce = (val) => {
      return spring(val, {
        stiffness: 330,
        damping: 22,
      });
    };

    const bounceTransition = {
      // start in a transparent, upscaled state
      atEnter: {
        opacity: 0,
        scale: 1,
      },
      // leave in a transparent, downscaled state
      atLeave: {
        opacity: bounce(0),
        scale: bounce(0.9),
      },
      // and rest at an opaque, normally-scaled state
      atActive: {
        opacity: bounce(1),
        scale: bounce(1),
      },
    };

    const mapStyles = (styles) => {
      return {
        opacity: styles.opacity,
        transform: `scale(${styles.scale})`,
      };
    };

    return (
      <div className="app">
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
          appLoaded={this.props.appLoaded}
        />
				{this.props.errors ? (
					<GlobalErrors errors={this.props.errors} handleClose={this.props.closeError} />
				) : null}
        {this.props.currentUser ? (
          <AnimatedSwitch
            atEnter={bounceTransition.atEnter}
            atLeave={bounceTransition.atLeave}
            atActive={bounceTransition.atActive}
            mapStyles={mapStyles}
            className="route-wrapper"
          >
            {this.props.appLoaded ? null : (
              <Route component={Loading} />
            )}
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/rooms" component={Rooms} />
            <Route exact path="/room/:roomId" component={Room} />
            <Route exact path="/bookings" component={Bookings} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/your-rooms" component={YourRooms} />
            <Route exact path="/your-rooms/add" component={RoomEditor} />
  					<Route exact path="/your-rooms/edit/:roomId" component={RoomEditor} />
            <Route component={Four_Oh_Four} />
          </AnimatedSwitch>
        ) : (
          <AnimatedSwitch
            atEnter={bounceTransition.atEnter}
            atLeave={bounceTransition.atLeave}
            atActive={bounceTransition.atActive}
            mapStyles={mapStyles}
            className="route-wrapper"
          >
            {this.props.appLoaded ? null : (
              <Route component={Loading} />
            )}
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/rooms" component={Rooms} />
            <Route exact path="/room/:roomId" component={Room} />
            <Route component={Four_Oh_Four} />
          </AnimatedSwitch>
        )}
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
									React, Redux, Express.js, Webpack
								</p>
							</div>
						</nav>
					</div>
				</footer>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
