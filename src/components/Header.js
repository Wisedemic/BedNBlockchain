import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = props => {
  if (!props.currentUser) {
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
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
			<div className="navbar-end">
	      <div className="navbar-item">
	        <div className="field">
	          <p className="control">
	            <Link className="button is-text" to="/logout">
	            	Logout
	            </Link>
	          </p>
	        </div>
	      </div>
			</div>
    );
  }
  return null;
};

class Header extends React.Component {
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
      <nav className="navbar is-fixed-top is-dark">
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
          <LoggedInView currentUser={this.props.currentUser} />
          <LoggedOutView currentUser={this.props.currentUser} />
        </div>
      </nav>
    );
  }
}

export default Header;
