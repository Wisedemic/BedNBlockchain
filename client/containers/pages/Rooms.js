import React, {	Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import agent from '../../agent';

import Room from '../../components/Room';

import Banner from '../../assets/banner6.jpg';

import {
  LOAD_PAGE,
  UNLOAD_PAGE,
  ROOMS
} from '../../actions';

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  roomsList: state.rooms.roomsList,
  reload: state.rooms.reload
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => {
    const payload = agent.Rooms.all();
    dispatch({ type: LOAD_PAGE.ROOMS, payload });
  },
  onUnload: () => dispatch({ type: UNLOAD_PAGE.ROOMS }),
  bookRoom: (buyerId, ownerId, roomId, price, guests) => {
    console.log('Booking room', buyerId, ownerId, roomId, price, guests);
    const payload = agent.Bookings.bookRoom(buyerId, ownerId, roomId, price, guests);
    dispatch({ type: ROOMS.BOOK, payload });
  }
});

class Rooms extends Component {
  constructor() {
    super();
    this.bookRoom = (ownerId, roomId, price, guests) => this.props.bookRoom(this.props.currentUser.id, ownerId, roomId, price, guests);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload === true) {
      this.props.onLoad();
    }
  }

  render() {
    return (
			<section id="browse" className="hero is-light is-bold is-fullheight">
        <div className="hero-head">
          <div className="hero-banner" style={{backgroundImage: 'url('+Banner+')'}}></div>
          <div className="container has-text-centered">
            <h2 className="title is-2">Browse Rooms</h2>
          </div>
        </div>
				<div className="hero-body">
					<div className="container">
						<div id="rooms">
							{this.props.roomsList.length > 0 ? (
								this.props.roomsList.map((room, index) => {
                  const locationObj = room.location.formatted_address.split(', ');
									return (
                    <Room
                      key={index}
                      onClick={this.bookRoom}
                      roomId={room.id}
                      ownerId={room.ownerId}
                      title={room.title}
                      featuredImage={room.featuredImageId}
                      roomType={room.roomType}
                      propertyType={room.propertyType}
                      price={room.price}
                      guests={room.guests}
                      location={locationObj}
                      booked={room.booked}
                      currentUser={this.props.currentUser}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
