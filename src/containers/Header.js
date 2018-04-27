// React + Redux
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Actions
import { LOGOUT } from '../actions';

// Assets
import defaultUserAvatar from './assets/defaultUserAvatar.png';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  handleLogout: () => dispatch({ type: LOGOUT })
});

const Avatar = props => {
  if (props.avatar) {
    return (
      <img src={props.avatar} alt='User Avatar'/>
    );
  } else {
    return (
      <img src={defaultUserAvatar} alt='User Avatar' />
    );
  }
};

const NavButtons = props => {
  if (props.appLoaded && props.currentUser) {
    return (
			<div className="navbar-end">
        <div className="navbar-item">
          <div className="field">
            <p className="control">
              <Link className="button is-outlined is-info" to="/rooms/">
                <span className="icon">
                  <i className="fa fa-bed"></i>
                </span>
                <span>Book Now!</span>
              </Link>
            </p>
          </div>
        </div>
	      <div className="navbar-item has-dropdown is-hoverable">
          <p className="navbar-link">
            <Avatar avatar={props.currentUser.avatar} />
          </p>
          <div className="navbar-dropdown is-right is-boxed">
            <Link className="navbar-item" to="/your-rooms">
              Your Rooms
            </Link>
            <Link className="navbar-item" to="/bookings">
              Your Reservations
            </Link>
            <Link className="navbar-item" to="/profile/">
              Profile
            </Link>
            <Link className="navbar-item" to="/settings">
              Settings
            </Link>
            <div className="navbar-divider"></div>
            <a className="navbar-item" onClick={props.handleLogout}>
            	Logout
  	        </a>
          </div>
        </div>
			</div>
    );
  } else {
    return (
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="field is-grouped">
            <p className="control">
              <Link className="button" to="/signup">
                Sign Up
              </Link>
            </p>
            <p className="control">
              <Link className="button is-primary" to="/login">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
};

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggled: false
    }
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState((prevState) => {
      return {toggled: !prevState.toggled};
    });
  }

  render() {
    return (
      <nav className="navbar is-fixed-top">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            {this.props.appName}
          </Link>
          <div
            className={'navbar-burger burger' + (this.state.toggled ? ' is-active' : '')}
            data-target="navbarMenu"
            onClick={this.onClick}
            >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarMenu" className={'navbar-menu' + (this.state.toggled ? ' is-active' : '')}>
          <div className="navbar-start">
						<div className="navbar-item has-dropdown is-hoverable">
			        <p className="navbar-link">
			          Rooms
			        </p>
			        <div className="navbar-dropdown is-boxed">
			          <Link className="navbar-item" to="/rooms">
			            Browse
			          </Link>
                {this.props.currentUser ?
                (<Link className="navbar-item" to="/your-rooms/add">
			            Add A Room
			          </Link>) : null}
			        </div>
			      </div>
					</div>
          <NavButtons
            appLoaded={this.props.appLoaded}
            handleLogout={this.props.handleLogout}
            currentUser={this.props.currentUser}
          />
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
