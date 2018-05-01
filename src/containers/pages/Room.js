import React, {	Component } from 'react';
import { connect } from 'react-redux';

import agent from '../../agent';

import {
  ROOM_PAGE_LOADED,
  ROOM_PAGE_UNLOADED
} from '../../actions';

const mapStateToProps = state => ({
  currentRoom: state.rooms.currentRoomInView,
  reload: state.rooms.reload,
  loading: state.rooms.loading
});

const mapDispatchToProps = dispatch => ({
  onLoad: (id) => {
    const payload = agent.Rooms.getRoom(id);
    dispatch({ type: ROOM_PAGE_LOADED, payload });
  },
  onUnload: () =>
    dispatch({ type: ROOM_PAGE_UNLOADED })
});

class Room extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    console.log(this.props)
    this.props.onLoad(this.props.match.params.roomId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    console.log('render', this.props);
    if (this.props.currentRoom) {
      return (
        <div>
  	      <section id="room" className="hero is-info is-bold">
  					<div className="banner room-banner" style={{backgroundImage: 'url(http://localhost:3001/api/uploads/'+this.props.currentRoom.featuredImageId+')'}}></div>
  					<div className="hero-body">
  						<div className="container has-text-centered">
  		          <h1 className="title is-1">{this.props.currentRoom.title}</h1>
  							<h4 className="subtitle is-4">{this.props.currentRoom.propertyType} | {this.props.currentRoom.roomType}</h4>
  						</div>
  	        </div>
  	      </section>
  				<section id="details" className="hero is-fullheight">
  					<div className="hero-body">
  						<div className="container">
  							<h4 className="subtitle is-4">${this.props.currentRoom.price} / Day</h4>
  						</div>
  					</div>
  				</section>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
