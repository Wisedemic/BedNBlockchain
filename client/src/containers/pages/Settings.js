import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import agent from '../../agent';
import { connect } from 'react-redux';

import ErrorList from '../../components/ErrorList';
// import Field from '../../components/Field';

import {
	SIGNUP,
	SIGNUP_PAGE_LOADED,
	SIGNUP_PAGE_UNLOADED,
	UPDATE_AUTH_FIELD,
	FIELD_ERROR,
	CLOSE_ERROR
} from '../../actions';

// Mapping Global Redux State to React Props
const mapStateToProps = state => ({
	...state.auth,
	email: state.auth.email,
	password: state.auth.password,
	passwordConfirm: state.auth.passwordConfirm
});

// Action Creators
const mapDispatchToProps = dispatch => ({
	onLoad: () => dispatch({ type: SIGNUP_PAGE_LOADED }),
	onUnload: () => dispatch({ type: SIGNUP_PAGE_UNLOADED }),
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
		} else if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(value).toLowerCase()))) {
			dispatch({
				type: FIELD_ERROR,
				key: key,
				message: 'Must be a proper email! Ex. elon@spacex.com',
				inputState: 'is-danger',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_AUTH_FIELD, key: key, value: value })
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
				dispatch({ type: UPDATE_AUTH_FIELD, key: key, value: value })
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
			dispatch({ type: UPDATE_AUTH_FIELD, key: key, value: passwordConfirm })
		}
	},
	handleSubmit: (email, password, passwordConfirm) => {
		const payload = agent.Auth.signup(email, password, passwordConfirm);
		console.log('PAYLOAD', payload);
		dispatch({ type: SIGNUP, payload })
	},
	closeError: () => dispatch({ type: CLOSE_ERROR })
});

export class Settings extends Component {
	constructor() {
		super();
		// Grab the input on input Change Events
		this.onChangeEmail = ev => this.props.onChangeEmail(ev.target.value);
		this.onChangePassword =  ev => this.props.onChangePassword(ev.target.value);
		this.onChangePasswordConfirm =  ev =>this.props.onChangePasswordConfirm(this.props.password.value, ev.target.value);

		// Form Submit Handling
		this.submitForm = (email, password, passwordConfirm) => ev => {
			ev.preventDefault();
			this.props.handleSubmit(email, password, passwordConfirm);
		}
	}
	componentWillMount() {
		this.props.onLoad();
	}

	componentWillUnmount() {
		this.props.onUnload();
	}

  render() {
		// const email = this.props.email.value;
    // const password = this.props.password.value;
    // const passwordConfirm = this.props.passwordConfirm.value;
    return (
      <section id="settings" className="hero is-light is-fullheight">
        <div className="hero-body">
					<div className="columns is-centered" style={{flexGrow: 1}}>
						<div className="column is-half">
							<ErrorList
								handleClose={this.props.closeError}
								errors={this.props.errors} />
              <h1 className="title is-1">Settings</h1>
              <div className="box">
  							{/*<form onSubmit={this.submitForm(email, password, passwordConfirm)}>
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
  											className={'button is-primary' + (this.props.inProgress ? ' is-loading': '') + (this.props.email.valid && this.props.password.valid && this.props.passwordConfirm.valid ? '' : ' is-outlined')}
  											onClick={this.submitForm}
  											disabled={(this.props.email.valid && this.props.password.valid && this.props.passwordConfirm.valid) ? false : 'disabled'}
											>
  											Save
  										</button>
  									</p>
  								</div>
  							</form> */}
              </div>
						</div>
					</div>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
