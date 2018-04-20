import React, {	Component } from 'react';
import { connect } from 'react-redux';

import agent from '../../agent';

import {
  ROOM_PAGE_LOADED,
  ROOM_PAGE_UNLOADED
} from '../../actions';

const mapStateToProps = state => ({
  ...state.rooms
});

const mapDispatchToProps = dispatch => ({
  onLoad: (id) => {
    const payload = agent.Rooms.getRoom(id);
    dispatch({ type: ROOM_PAGE_LOADED, payload })
  },
  onUnload: () =>
    dispatch({ type: ROOM_PAGE_UNLOADED })
});

class Room extends Component {
  componentDidMount() {
    this.props.onLoad(this.props.match.params.roomId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="room" className="hero is-light is-fullheight">
        <div className="hero-body has-bg-img">
          <h2 className="title is-2">Room</h2>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
