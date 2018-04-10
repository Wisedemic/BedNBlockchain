import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <div>loggedout</div>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <ul className="nav"></ul>
    );
  }
  return null;
};

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar is-fixed-top is-dark">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            {this.props.appName}
          </Link>
          <div className="navbar-burger burger" data-target="navbarMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarMenu" className="navbar-menu">
          <div className="navbar-start"></div>
          <div className="navbar-end">
            <LoggedInView currentUser={this.props.currentUser} />
            <LoggedOutView currentUser={this.props.currentUser} />
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
