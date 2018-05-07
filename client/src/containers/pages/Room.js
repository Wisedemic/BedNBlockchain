import React, {	Component } from 'react';
import { connect } from 'react-redux';

import agent from '../../agent';

import {
  LOAD_PAGE,
  UNLOAD_PAGE
} from '../../actions';

const mapStateToProps = state => ({
  currentRoom: state.rooms.currentRoomInView,
  reload: state.rooms.reload,
  loading: state.rooms.loading
});

const mapDispatchToProps = dispatch => ({
  onLoad: (id) => {
    const payload = agent.Rooms.getRoom(id);
    dispatch({ type: LOAD_PAGE.ROOM, payload });
  },
  onUnload: () =>
    dispatch({ type: UNLOAD_PAGE.ROOM })
});

class Room extends Component {
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
  	      <section id="room-header" className="hero is-info is-bold">
            <div className="banner room-banner" style={{backgroundImage: 'url(http://localhost:3001/api/uploads/'+this.props.currentRoom.featuredImageId+')'}}></div>
			      <div className="hero-body">
              <div className="container has-text-centered">
  		          <h1 className="title is-1">{this.props.currentRoom.title}</h1>
  							<h4 className="subtitle is-4">{this.props.currentRoom.propertyType} | {this.props.currentRoom.roomType}</h4>
  						</div>
  	        </div>
  	      </section>
  				<section id="room-details" className="hero is-fullheight">
  					<div className="hero-body">
  						<div className="container is-fluid">
                <div className="columns">
                  <div className="column">
                    <h5 id="booked" className="subtitle is-5">{this.props.currentRoom.booked ? 'Available for booking!' : (<span style={{color: '#e84c3d'}}>This room is booked!</span>)}</h5>
      							<h2 id="price" className="title is-2">${this.props.currentRoom.price} <span className="units" style={{fontSize: '20px'}}>/ Day</span></h2>
                    <p id="address" className="content">
                      <strong>Address: </strong>{this.props.currentRoom.location.formatted_address}
                    </p>
                    <hr />
                    <div id="details">
                      <h5 className="subtitle is-5">Room Details</h5>
                      <p className="content">{this.props.currentRoom.description}</p>
                    </div>
                  </div>
                  <div className="column sidebar is-one-third">
                    <div className="box">

                    </div>
                  </div>
                </div>
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
