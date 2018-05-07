import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Room from '../../components/Room';

import agent from '../../agent';

import {
  LOAD_PAGE,
  UNLOAD_PAGE,
  ROOMS
} from '../../actions';

import Banner from '../assets/banner.jpg';

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  appName: state.common.appName,
  token: state.common.token,
  roomsList: state.rooms.roomsList,
  reload: state.rooms.reload
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => {
    const payload = agent.Rooms.all();
    dispatch({ type: LOAD_PAGE.HOME, payload });
  },
  onUnload: () =>
    dispatch({ type: UNLOAD_PAGE.HOME }),
  bookRoom: (buyerId, ownerId, roomId, price, guests) => {
    console.log('Booking room', buyerId, ownerId, roomId, price, guests);
    const payload = agent.Bookings.bookRoom(buyerId, ownerId, roomId, price, guests);
    dispatch({ type: ROOMS.BOOK, payload });
  }
});

class Home extends Component {
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
			<div>
	      <section id="home" className="hero is-light is-fullheight">
					<div className="banner" style={{backgroundImage: 'url('+Banner+')'}}></div>
					<div className="hero-body">
						<div className="container has-text-centered">
		          <h1 className="title is-1">Find a Room, or List One</h1>
							<h4 className="subtitle is-4">{this.props.appName} does it all!</h4>
							<div className="columns is-mobile is-centered">
								<div className="column is-narrow">
									<div className="field has-addons">
									  <p className="control">
									    <Link className="button is-info is-outlined is-medium" to={this.props.token ? '/rooms' : '/login'}>
									      <span>Book Now</span>
									    </Link>
									  </p>
									  <p className="control">
									    <Link className="button is-danger is-outlined is-medium" to={this.props.token ? '/your-rooms/add' : '/login'}>
									      <span>List A Property</span>
									    </Link>
									  </p>
									</div>
								</div>
							</div>
						</div>
	        </div>
	      </section>
				<section id="featured" className="hero is-fullheight">
					<div className="hero-body">
						<div className="container has-text-centered">
							<h2 className="title is-2">Featured Rooms</h2>
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
			</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
