import React, { Component } from 'react';
import agent from '../agent';
import { connect } from 'react-redux';

import ErrorList from './ErrorList';
import Field from './Field';

import {
	SIGNUP,
	UPDATE_FIELD_AUTH,
	FIELD_ERROR,
	CLOSE_ERROR
} from '../actions';

// Mapping Global Redux State to React Props
const mapStateToProps = state => ({
	...state.auth,
	email: state.auth.email,
	password: state.auth.password,
	passwordConfirm: state.auth.passwordConfirm
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
		} else if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase()))) {
			dispatch({
				type: FIELD_ERROR,
				key: key,
				message: 'Must be a proper email! Ex. elon@spacex.com',
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
  onChangePasswordConfirm: (password, passwordConfirm) => {
	const key = 'passwordConfirm';
	if (passwordConfirm.length === 0) {
		dispatch({
			type: FIELD_ERROR,
			key: key,
			message: 'Password cannot be blank!',
			inputState: 'is-danger',
			value: passwordConfirm
		});
	} else if (passwordConfirm.length > 16 || passwordConfirm.length < 6) {
			dispatch({
				type: FIELD_ERROR,
				key: key,
				message: 'Password length must be between 6-16 characters!',
				inputState: 'is-warning',
				value: passwordConfirm
			});
		} else if (password !== passwordConfirm) {
			dispatch({
				type: FIELD_ERROR,
				key: key,
				message: 'Passwords Must Match!',
				inputState: 'is-danger',
				value: passwordConfirm
			});
		} else {
			dispatch({ type: UPDATE_FIELD_AUTH, key: key, value: passwordConfirm })
		}
	},
	handleSubmit: (email, password, passwordConfirm) => {
		const payload = agent.Auth.signup(email, password, passwordConfirm);
		console.log('PAYLOAD', payload);
		dispatch({ type: SIGNUP, payload })
	},
	closeError: () =>
		dispatch({ type: CLOSE_ERROR })
});

export class Signup extends Component {
	constructor() {
		super();
		this.disabled = true;
		// Grab the input on input Change Events
		this.onChangeEmail = ev => this.props.onChangeEmail(ev.target.value);
		this.onChangePassword =  ev => this.props.onChangePassword(ev.target.value);
		this.onChangePasswordConfirm =  ev =>this.props.onChangePasswordConfirm(this.props.password.value, ev.target.value);

		// Form Submit Handling
		this.submitForm = (email, password, passwordConfirm) => ev => {
			ev.preventDefault();
			if (
				this.props.email.valid &&
				this.props.password.valid	&&
				this.props.passwordConfirm.valid
			) {
				this.props.handleSubmit(email, password, passwordConfirm);
			}
		}
	}

  render() {
		const email = this.props.email.value;
    const password = this.props.password.value;
    const passwordConfirm = this.props.passwordConfirm.value;
		if (this.props.email.valid && this.props.password.valid && this.props.passwordConfirm.valid) {
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
							<h1 className="title is-1">Sign up to coninue</h1>
							<form onSubmit={this.submitForm(email, password, passwordConfirm)}>
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
								<Field
									key={'passwordConfirm'}
									type={'password'}
									value={this.props.passwordConfirm.value}
									placeholder={'Re-enter password'}
									onChange={this.onChangePasswordConfirm}
									inputState={this.props.passwordConfirm.inputState}
									message={this.props.passwordConfirm.message}
								/>
								<div className="field">
									<p className="control">
										<button
											className={'button is-primary' + (this.props.inProgress ? ' is-loading': '')}
											onClick={this.submitForm}
											disabled={this.disabled ? 'disabled' : false}
											>
											Sign Up
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
