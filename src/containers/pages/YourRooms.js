import React, {	Component } from 'react';
import { connect } from 'react-redux';

import agent from '../../agent';

import {
  YOURROOMS_PAGE_LOADED,
  YOURROOMS_PAGE_UNLOADED,
  // ADD_ROOM,
  // UPDATE_ROOM_AUTH,
  // ROOM_FIELD_ERROR,
  CLOSE_ERROR
} from '../../actions';

const mapStateToProps = state => ({
  yourRooms: state.rooms.yourRooms,
  userId: state.common.currentUser ? state.common.currentUser.id : null
});

const mapDispatchToProps = dispatch => ({
  onLoad: (userId) => {
    const payload = agent.Rooms.roomByUserId(userId);
    dispatch({ type: YOURROOMS_PAGE_LOADED, payload })
  },
  onUnload: () => dispatch({ type: YOURROOMS_PAGE_UNLOADED }),
  closeError: () => dispatch({ type: CLOSE_ERROR })
});

class YourRooms extends Component {
  componentDidMount() {
    console.log(this.props);
    this.props.onLoad(this.props.userId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="yourRooms" className="hero is-info is-bold is-fullheight">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h2 className="title is-2">Your Rooms</h2>
						<div className="box">
							{this.props.yourRooms ? (
								this.props.yourRooms.map((room, index) => {
									return (
										<div className="box" key={index}>
											<code>{room.id}</code>
										</div>
									);
								}, this)
							) : (
								<div className="box">
								<code>No Rooms Found</code>
							</div>
						)}
						</div>
					</div>
				</div>
			</section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YourRooms);
