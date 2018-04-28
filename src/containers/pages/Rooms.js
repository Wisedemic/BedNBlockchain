import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import agent from '../../agent';

import {
  ROOMS_PAGE_LOADED,
  ROOMS_PAGE_UNLOADED
} from '../../actions';


import parser from 'parse-address';

const mapStateToProps = state => ({
  roomsList: state.rooms.roomsList
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => {
    const payload = agent.Rooms.all();
    dispatch({ type: ROOMS_PAGE_LOADED, payload })
  },
  onUnload: () =>
    dispatch({ type: ROOMS_PAGE_UNLOADED })
});

class Rooms extends Component {
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
                    console.log(location);
										return (
											<div className="card room" key={index}>
												<Link to={'/room/' + room.id} className="card-image">
											    <figure className="image is-4by3">
											      <img src={'http://localhost:3001/api/uploads/' + room.featuredImageId} alt="Placeholder image" />
											    </figure>
											  </Link>
												<div className="card-content">
													<div className="details-header">
														<h5 className="title is-5">{room.title}</h5>
                          </div>
                          <div className="details-body">
                            <div className="location">
                              <span>{location[0] + ', ' + location[1]} | <span className="price">{'$' + room.price + '/ Day'}</span></span>
                            </div>
                            <button className="button is-info">Instant Book</button>
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
