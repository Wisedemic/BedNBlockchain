import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
    this.editRoom = id => this.props.editRoom(id);
    this.deleteRoom = id => this.props.deleteRoom(id);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="yourRooms" className="hero is-light is-bold is-fullheight">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h2 className="title is-2">Your Rooms</h2>
						<div className="rooms">
							{this.props.yourRooms ? (
								this.props.yourRooms.map((room, index) => {
									return (
										<div className="box" key={index}>
                      <figure className="image is-128x128">
                        <img src={'http://localhost:3001/api/uploads/' + room.featuredImageId} alt="Placeholder image" />
                      </figure>
                      <div className="details">
                        <h5 className="title is-5">{room.title}</h5>
                        <h6 className="subtitle room-type is-6">{room.roomType} | {room.propertyType}</h6>
                      </div>
                      <p className="buttons">
                        <Link to={'/your-rooms/edit/'+room.id} className="button is-info"><span>Edit</span></Link>
                        <button onClick={() => this.deleteRoom(room.id)} className="button is-danger is-outlined">
                          <span className="icon">
                            <i className="fa fa-exclamation-triangle"></i>
                          </span>
                          <span>Delete</span>
                        </button>
                      </p>
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
