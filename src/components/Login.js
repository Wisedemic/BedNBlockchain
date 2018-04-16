import React, { Component } from 'react';
import agent from '../agent';
import { connect } from 'react-redux';

import ErrorList from './ErrorList';
import Field from './Field';

import {
	LOGIN,
	UPDATE_FIELD_AUTH,
	FIELD_ERROR,
	CLOSE_ERROR
} from '../actions';

// Mapping Global Redux State to React Props
const mapStateToProps = state => ({
	...state.auth,
	email: state.auth.email,
	password: state.auth.password
});

// Action Creators
const mapDispatchToProps = dispatch => ({
	onChangeEmail: value => {
		const key = 'email';
		if (value.length === 0) {
			dispatch({
				type: FIELD_ERROR,
				key: key,
				message: 'Email cannot be blank!',
				inputState: 'is-danger',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_FIELD_AUTH, key: key, value: value })
		}
	},
  onChangePassword: value => {
		const key = 'password';
		if (value.length === 0) {
			dispatch({
				type: FIELD_ERROR,
				key: key,
				message: 'Password cannot be blank!',
				inputState: 'is-danger',
				value: value
			});
		} else if (value.length > 16 || value.length < 6) {
			dispatch({
				type: FIELD_ERROR,
				key: key,
				message: 'Password length must be between 6-16 characters!',
				inputState: 'is-warning',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_FIELD_AUTH, key: key, value: value })
		}
	},
	handleSubmit: (email, password) => {
		const payload = agent.Auth.login(email, password);
		console.log('PAYLOAD', payload);
		dispatch({ type: LOGIN, payload })
	},
	closeError: () =>
		dispatch({ type: CLOSE_ERROR })
});

export class Login extends Component {
	constructor() {
		super();
		this.disabled = true;

    // Grab the input on input Change Events
		this.onChangeEmail = ev => this.props.onChangeEmail(ev.target.value);
		this.onChangePassword =  ev => this.props.onChangePassword(ev.target.value);

		// Form Submit Handling
		this.submitForm = (email, password, passwordConfirm) => ev => {
			ev.preventDefault();
			if (this.props.email.valid && this.props.password.valid) {
				this.props.handleSubmit(email, password);
			}
		}
	}

  render() {
		const email = this.props.email.value;
    const password = this.props.password.value;
		if (this.props.email.valid && this.props.password.valid) {
			this.disabled = false;
		} else {
			this.disabled = true;
		}
    return (
      <section id="signup" className="hero is-light is-fullheight">
        <div className="hero-body">
					<div className="columns is-centered" style={{flexGrow: 1}}>
						<div className="column is-half">
							<ErrorList
								handleClose={this.props.closeError}
								errors={this.props.errors} />
              <h2 className="title is-2">Login to continue</h2>
							<form onSubmit={this.submitForm(email, password)}>
								<Field
									key={'email'}
									type={'text'}
									value={this.props.email.value}
									placeholder={'Enter your email'}
									onChange={this.onChangeEmail}
									inputState={this.props.email.inputState}
									message={this.props.email.message}
								/>
								<Field
									key={'password'}
									type={'password'}
									value={this.props.password.value}
									placeholder={'Enter your password'}
									onChange={this.onChangePassword}
									inputState={this.props.password.inputState}
									message={this.props.password.message}
								/>
								<div className="field">
									<p className="control">
										<button
											className={'button is-primary' + (this.props.inProgress ? ' is-loading': '')}
											onClick={this.submitForm}
											disabled={this.disabled ? 'disabled' : false}
											>
											Login
										</button>
                  </p>
								</div>
							</form>
						</div>
					</div>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
