import React, { Component } from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
	SIGNUP,
	SIGNUP_PAGE_UNLOADED,
	UPDATE_FIELD_AUTH
} from '../actions';

// Mapping Global Redux State to React Props
const mapStateToProps = state => ({
	...state.auth,
});

// Action Creators
const mapDispatchToProps = dispatch => ({
	onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onChangeUsername: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
	handleSubmit: (email, password) => {
		const payload = agent.Auth.signup(email, password);
		dispatch({ type: SIGNUP, payload })
	},
	onUnload: () =>
    dispatch({ type: SIGNUP_PAGE_UNLOADED })
});

export class Signup extends Component {
	constructor() {
		super();
		this.submitForm = (email, password) => ev => {
			ev.preventDefault();
			/*--
				Sanitize
			--*/
			this.props.handleSubmit(email, password);
		}
	}
	componentWillUnmount() {
    this.props.onUnload();
   }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    return (
      <section id="signup" className="hero is-light is-fullheight">
        <div className="hero-body">
          <h1 className="title is-1">SIGNUP PAGE</h1>
					<form onSubmit={this.submitForm(email, password)}>

						<div class="field">
						  <p class="control has-icons-left has-icons-right">
						    <input class="input" type="email" placeholder="Email" value={this.props.email} />
						    <span class="icon is-small is-left">
						      <i class="fas fa-envelope"></i>
						    </span>
						    <span class="icon is-small is-right">
						      <i class="fas fa-check"></i>
						    </span>
						  </p>
						</div>

						<div class="field">
						  <p class="control has-icons-left">
						    <input class="input" type="password" placeholder="Password" value={this.props.password} />
						    <span class="icon is-small is-left">
						      <i class="fas fa-lock"></i>
						    </span>
						  </p>
						</div>

						<div class="field">
						  <p class="control">
						    <button class="button is-success" onClick={this.submitForm}>
						      Login
						    </button>
						  </p>
						</div>

					</form>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
