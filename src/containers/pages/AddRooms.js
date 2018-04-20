import React, {	Component } from 'react';
import { connect } from 'react-redux';

import ErrorList from '../../components/ErrorList';
import Field from '../../components/Field';

import agent from '../../agent';

import {
  ADD_ROOM,
  ADD_ROOM_PAGE_LOADED,
  ADD_ROOM_PAGE_UNLOADED,
  UPDATE_ADD_ROOM_FIELD,
  ADD_ROOM_FIELD_ERROR,
  CLOSE_ERROR
} from '../../actions';

const mapStateToProps = state => ({
  ...state.rooms,
  title: state.addRoom.title,
  desc: state.addRoom.desc
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => {
    dispatch({ type: ADD_ROOM_PAGE_LOADED })
  },
  onUnload: () =>
    dispatch({ type: ADD_ROOM_PAGE_UNLOADED }),
  handleSubmit: (title, desc) => {
    const payload = agent.Rooms.add(title, desc);
    console.log('PAYLOAD', payload);
    dispatch({ type: ADD_ROOM, payload });
  },
  onChangeTitle: value => {
		const key = 'title';
		if (value.length === 0) {
			dispatch({
				type: ADD_ROOM_FIELD_ERROR,
				key: key,
				message: 'Title cannot be blank!',
				inputState: 'is-danger',
				value: value
			});
		} else if (value.length < 6 || value.length > 140) {
			dispatch({
				type: ADD_ROOM_FIELD_ERROR,
				key: key,
				message: 'Must be between 4-140 characters!',
				inputState: 'is-warning',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_ADD_ROOM_FIELD, key: key, value: value })
		}
	},
  onChangeDesc: value => {
		const key = 'desc';
		if (value.length === 0) {
			dispatch({
				type: ADD_ROOM_FIELD_ERROR,
				key: key,
				message: 'Description cannot be blank!',
				inputState: 'is-danger',
				value: value
			});
		} else if (value.length < 6 || value.length > 500) {
			dispatch({
				type: ADD_ROOM_FIELD_ERROR,
				key: key,
				message: 'Must be between 6-500 characters!',
				inputState: 'is-warning',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_ADD_ROOM_FIELD, key: key, value: value })
		}
	}
});

class YourRooms extends Component {
  constructor() {
    super();
    this.disabled = true;

    this.onChangeTitle = ev => this.props.onChangeTitle(ev.target.value);
    this.onChangeDesc = ev => this.props.onChangeDesc(ev.target.value);

    this.submitForm = (title, desc) => ev => {
      ev.preventDefault();
      // Don't send form if required fields aren't filled out.
      if (this.props.title.valid && this.props.desc.valid) {
        this.props.handleSubmit(title, desc);
      }
    };
  }

  componentDidMount() {
    this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (this.props.match.path = '/your-rooms/add') {
      const title = this.props.title.value;
      const desc = this.props.desc.value;
      if (this.props.title.valid && this.props.desc.valid) {
  			this.disabled = false;
  		} else {
  			this.disabled = true;
  		}
      return (
        <section id="rooms" className="hero is-light is-bold is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h2 className="title is-2 has-text-centered">Add A Room</h2>
              <div className="box">
                <form onSubmit={this.submitForm(title, desc)}>
  								<Field
  									key={'title'}
  									type={'text'}
                    label={'Title'}
  									value={this.props.title.value}
  									placeholder={'A Stunning Two Bedroom Home!'}
  									onChange={this.onChangeTitle}
  									inputState={this.props.title.inputState}
  									message={this.props.title.message}
  								/>
  								<Field
  									key={'desc'}
                    label={'Description'}
  									type={'textarea'}
  									value={this.props.desc.value}
  									placeholder={'This gorgeous home has everything you need ....'}
  									onChange={this.onChangeDesc}
  									inputState={this.props.desc.inputState}
  									message={this.props.desc.message}
  								/>
  								<div className="field">
  									<p className="control">
  										<button
  											className={'button is-primary' + (this.props.inProgress ? ' is-loading': '')}
  											onClick={this.submitForm}
  											disabled={this.disabled ? 'disabled' : false}
  											>
  											Submit
  										</button>
                    </p>
  								</div>
  							</form>
              </div>
            </div>
          </div>
        </section>
      )
    } else {
      return (
  			<section id="rooms" className="hero is-info is-bold is-fullheight">
          <div className="hero-body">
            <h2 className="title is-2">Your Rooms</h2>
          </div>
        </section>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YourRooms);
