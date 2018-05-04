import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { connect } from 'react-redux';

import ErrorList from '../../components/ErrorList';
import Field from '../../components/Field';

import {
	LOGIN,
	LOGIN_PAGE_LOADED,
	LOGIN_PAGE_UNLOADED,
	UPDATE_AUTH_FIELD,
	FIELD_ERROR,
	CLOSE_ERROR
} from '../../actions';

// Mapping Global Redux State to React Props
const mapStateToProps = state => ({
	...state.auth,
	email: state.auth.email,
	password: state.auth.password,
	errors: state.auth.errors
});

// Action Creators
const mapDispatchToProps = dispatch => ({
	onLoad: () => {
		dispatch({ type: LOGIN_PAGE_LOADED }) },
	unLoad: () => dispatch({ type: LOGIN_PAGE_UNLOADED }),
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

    // Grab the input on input Change Events
		this.onChangeEmail = ev => this.props.onChangeEmail(ev.target.value);
		this.onChangePassword =  ev => this.props.onChangePassword(ev.target.value);

		// Form Submit Handling
		this.submitForm = (email, password, passwordConfirm) => ev => {
			ev.preventDefault();
			this.props.handleSubmit(email, password);
		}
	}

	componentWillMount() {
		this.props.onLoad();
	}

	componentWillUnmount() {
		this.props.unLoad();
	}

  render() {
		const email = this.props.email.value;
    const password = this.props.password.value;
    return (
      <section id="signup" className="hero is-light is-fullheight">
        <div className="hero-body">
					<div className="columns is-centered" style={{flexGrow: 1}}>
						<div className="column is-half">
							<ErrorList
								handleClose={this.props.closeError}
								errors={this.props.errors} />
							<h2 className="title is-2">Log In</h2>
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
								<div className="field is-grouped">
									<p className="control">
										<button
											className={'button is-primary' + (this.props.inProgress ? ' is-loading': '') + (this.props.email.valid && this.props.password.valid ? '' : ' is-outlined')}
											onClick={this.submitForm}
											disabled={(this.props.email.valid && this.props.password.valid) ? false : 'disabled'}
										>
											Log In
										</button>
                  </p>
									<p className="or">or</p>
									<p className="control">
										<Link className={'button is-text'} to="/signup">
											Sign Up
										</Link>
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
