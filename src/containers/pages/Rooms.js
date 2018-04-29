import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import agent from '../../agent';

import {
  ROOMS_PAGE_LOADED,
  ROOMS_PAGE_UNLOADED
} from '../../actions';

const mapStateToProps = state => ({
  roomsList: state.rooms.roomsList
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => {
    const payload = agent.Rooms.all();
    dispatch({ type: ROOMS_PAGE_LOADED, payload })
  },
  onUnload: () => dispatch({ type: ROOMS_PAGE_UNLOADED }),
  bookRoom: (id) => {
    console.log('Booking room: ', id);
  }
});

class Rooms extends Component {
  constructor() {
    super();
    this.bookRoom = id => this.props.bookRoom(id);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="browse" className="hero is-light is-bold is-fullheight">
				<div className="hero-body">
					<div className="container is-fluid has-text-centered">
						<h2 className="title is-2">Browse Rooms</h2>
							<div id="rooms">
								{this.props.roomsList ? (
									this.props.roomsList.map((room, index) => {
                    const location = room.location.formatted_address.split(', ');
										return (
											<div className="card room" key={index}>
												<Link to={'/room/' + room.id} className="card-image">
											    <figure className="image is-4by3">
											      <img src={'http://localhost:3001/api/uploads/' + room.featuredImageId} alt="Placeholder image" />
											    </figure>
											  </Link>
												<div className="card-content">
													<div className="details-header">
                            <span style={{flexDirection: 'column'}}>
                              <h5 className="title is-5">{room.title}</h5>
                              <h6 className="subtitle room-type is-6">{room.roomType} | {room.propertyType}</h6>
                            </span>
                            <span className="price">
                              {'$' + room.price + '/ Day'}
                            </span>
                          </div>
                          <div className="details-body">
                            <div className="location">
                              <span>{location[0] + ', ' + location[1]}</span>
                            </div>
														<div className="guests">
                              <span id="adult" className="guest"><i className="fa fa-male"></i><span>{room.guests.adults}</span></span>
                              <span id="child" className="guest"><i className="fa fa-child"></i><span>{room.guests.children}</span></span>
                            </div>
                            <button onClick={() => this.bookRoom(room.id)} className="button is-info">Instant Book</button>
											    </div>
												</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
