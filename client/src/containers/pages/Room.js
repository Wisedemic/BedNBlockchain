import React, {	Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import ErrorList from '../../components/ErrorList';
import Field from '../../components/Field';

import agent from '../../agent';

import {
  LOAD_PAGE,
  UNLOAD_PAGE,
  ROOMS
} from '../../actions';

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  currentRoom: state.rooms.currentRoomInView,
  reload: state.rooms.reload,
  loading: state.rooms.loading,
  guests: state.rooms.guests
});

const mapDispatchToProps = dispatch => ({
  onLoad: (id) => {
    const payload = agent.Rooms.getRoom(id);
    dispatch({ type: LOAD_PAGE.ROOM, payload });
  },
  onUnload: () => dispatch({ type: UNLOAD_PAGE.ROOM }),
	incrementGuests: (guestType) => dispatch({ type: ROOMS.INCREMENT_GUESTS, guestType }),
  decrementGuests: (guestType) => dispatch({ type: ROOMS.DECREMENT_GUESTS, guestType }),
  submitForm: (guests) => dispatch({ type: ROOMS.BOOK, guests: guests })
});

class Room extends Component {
  constructor() {
    super();
    this.incrementGuests = type => this.props.incrementGuests(type);
    this.decrementGusts = type => this.props.decrementGuests(type);
    this.submitForm = (guests) => ev => {
      ev.preventDefault();
      this.props.handleSubmit(this.props.currentUser.id, guests);
    };
  }
  componentDidMount() {
    console.log(this.props)
    this.props.onLoad(this.props.match.params.roomId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const guests = this.props.guests.value;
    console.log('render', this.props);
    if (this.props.currentRoom) {
      return (
        <div>
  	      <section id="room-header" className="hero is-bold">
            <div className="banner room-banner" style={{backgroundImage: 'url(http://localhost:3001/api/uploads/'+this.props.currentRoom.featuredImageId+')'}}></div>
			      <div className="hero-body">
              <div className="container has-text-centered">
  		          <h1 className="title is-1">{this.props.currentRoom.title}</h1>
  							<h4 className="subtitle is-4">{this.props.currentRoom.propertyType} | {this.props.currentRoom.roomType}</h4>
  						</div>
  	        </div>
  	      </section>
  				<section id="room-details" className="hero is-light is-fullheight">
  					<div className="hero-body">
  						<div className="container is-fluid">
                <div className="columns">
                  <div className="column">
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
                    <div className="card">
                      <div className="card-content">
                        <h5 id="booked" className="title is-5">{this.props.currentRoom.booked ? (<span style={{color: '#e84c3d'}}>This room is booked!</span>) : 'Available for booking!'}</h5>
                        {this.props.currentRoom.booked ? (
                          <Link to="/rooms/" className="button is-info">Browse Rooms</Link>
                        ) : (
                          <form onSubmit={this.submitForm(guests)}>
                            <h6 className="subtitle is-6">How many guests?</h6>
                            <Field
                              key={'adults'}
                              label={'Adults'}
                              type={'incrementer'}
                              value={this.props.guests.value.adults}
                              isHorizontal={true}
                              hasAddonLeft={(<a className="button" onClick={() => this.props.incrementGuests('adults')}>+</a>)}
                              hasAddonRight={(<a className="button" onClick={() => this.props.decrementGuests('adults')}>-</a>)}
                            />
                            <Field
                              key={'children'}
                              label={'Children'}
                              type={'incrementer'}
                              value={this.props.guests.value.children}
                              isHorizontal={true}
                              hasAddonLeft={(<a className="button" onClick={() => this.props.incrementGuests('children')}>+</a>)}
                              hasAddonRight={(<a className="button" onClick={() => this.props.decrementGuests('children')}>-</a>)}
                            />
            								<div className="field">
            									<p className="control">
            										<button
            											className={'button is-success' +
            												(this.props.inProgress ? ' is-loading': '') +
            												(this.props.guests.valid ? '' : ' is-outlined')
          												}
            											onClick={this.submitForm}
            											disabled={this.props.guests.valid ? false : 'disabled'}
          											>
            											Submit
            										</button>
                              </p>
                              <p className="help is-success">{this.props.message ? this.props.message : null}</p>
            								</div>
                          </form>
                        )}
                      </div>
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
