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
          <div className="field is-grouped">
            <p className="control">
              <Link className="button is-outlined is-info" to="/rooms/">
                <span className="icon">
                  <i className="fa fa-book"></i>
                </span>
                <span>Book Now!</span>
              </Link>
            </p>
            <p className="control">
              <Link className="button is-outlined is-danger" to="/rooms/add">
                <span className="icon">
                  <i className="fa fa-plus"></i>
                </span>
                <span>List A Property</span>
              </Link>
            </p>
          </div>
        </div>
	      <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link">
            <Avatar avatar={props.currentUser.avatar} />
          </a>
          <div className="navbar-dropdown is-right is-boxed">
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
                Signup
              </Link>
            </p>
            <p className="control">
              <Link className="button is-primary" to="/login">
                Login
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
    super(props);

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
          <div className="navbar-start"></div>
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
