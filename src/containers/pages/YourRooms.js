import React, {	Component } from 'react';
import { connect } from 'react-redux';

import agent from '../../agent';

import {
  YOURROOMS_PAGE_LOADED,
  YOURROOMS_PAGE_UNLOADED,
  ADD_ROOM,
  UPDATE_ROOM_AUTH,
  ROOM_FIELD_ERROR,
  CLOSE_ERROR
} from '../../actions';

const mapStateToProps = state => ({
  ...state.rooms
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => {
    const payload = agent.Rooms.all();
    dispatch({ type: YOURROOMS_PAGE_LOADED, payload })
  },
  onUnload: () => dispatch({ type: YOURROOMS_PAGE_UNLOADED })
});

class YourRooms extends Component {
  componentDidMount() {
    this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="rooms" className="hero is-info is-bold is-fullheight">
        <div className="hero-body">
          <h2 className="title is-2">Your Rooms</h2>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YourRooms);
