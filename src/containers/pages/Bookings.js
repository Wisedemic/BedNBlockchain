import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Modal from '../../components/Modal';

import agent from '../../agent';

import {
  BOOKINGS_PAGE_LOADED,
  BOOKINGS_PAGE_UNLOADED,
  DELETE_BOOKING,
  CLOSE_ERROR
} from '../../actions';

const mapStateToProps = state => ({
  yourBookings: state.bookings.yourBookings,
  userId: state.common.currentUser ? state.common.currentUser.id : null,
  loading: state.bookings.loading,
  reload: state.bookings.reload
});

const mapDispatchToProps = dispatch => ({
  onLoad: (userId) => {
    const payload = agent.Bookings.bookingsByBuyerId(userId);
    dispatch({ type: BOOKINGS_PAGE_LOADED, payload })
  },
  onUnload: () => dispatch({ type: BOOKINGS_PAGE_UNLOADED }),
  closeError: () => dispatch({ type: CLOSE_ERROR }),
  deleteBooking: (bookingId) => {
    const payload = agent.Bookings.deleteBooking(bookingId);
    dispatch({ type: DELETE_BOOKING, payload });
  }
});

class Bookings extends Component {
  constructor() {
    super();

    this.state = {
      isModalActive: false,
      bookingId: ''
    };

    this.closeModal = () => {
      this.setState({isModalActive: false, bookingId: ''});
    };

    this.activateModal = (bookingId) => {
      this.setState({isModalActive: true, bookingId: bookingId});
    };

    this.editBooking = id => this.props.editBooking(id);
    this.deleteBooking = id => this.props.deleteBooking(id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload === true) {
      this.props.onLoad(this.props.userId);
      this.setState({isModalActive: false});
    }
  }

  componentDidMount() {
    console.log(this.props);
    this.props.onLoad(this.props.userId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="bookings" className="hero is-light is-bold is-fullheight">
        <Modal
          isActive={this.state.isModalActive}
          isLoading={this.props.loading}
          content={'Are you sure you would like to cancel this booking?'}
          confirmText={'Confirm'}
          onClose={this.closeModal}
          onClickConfirm={() => this.props.deleteBooking(this.state.bookingId)}
        />
				<div className="hero-body">
					<div className="container has-text-centered">
						<h2 className="title is-2">Your Bookings</h2>
						<div className="bookings">
							{this.props.yourBookings.length > 0 ? (
								this.props.yourBookings.map((booking, index) => {
									return (
										<div className="box" key={index}>
                      <figure className="image">
                        <img src={'http://localhost:3001/api/uploads/' + booking.room.featuredImageId} alt="Placeholder image" />
                      </figure>
                      <div className="details">
                        <h3 id="title" className="title is-5">{booking.room.title}</h3>
                        <h4 id="roomType" className="subtitle booking-type is-6">{booking.room.roomType} | {booking.room.propertyType}</h4>
                        <h4 id="price" className="title is-5">${booking.price} <span className="units" style={{fontSize: '20px'}}>/ Day</span></h4>
                    </div>
                      <p className="buttons">
												<Link to={'/room/'+booking.room._id} className="button is-info"><span>View Room Details</span></Link>
                        <Link to={'/bookings/edit/'+booking.id} className="button is-info"><span>Edit Booking</span></Link>
                        <button onClick={() => this.activateModal(booking.id)} className="button is-danger is-outlined">
                          <span className="icon">
                            <i className="fa fa-exclamation-triangle"></i>
                          </span>
                          <span>Cancel</span>
                        </button>
                      </p>
										</div>
									);
								}, this)
							) : (
                <div className="box has-text-centered" style={{flexDirection: 'column'}}>
                  <p className="content">You haven't booked a room yet!</p>
                  <Link to="/browse" className="button is-info">Book a room!</Link>
                </div>
						)}
						</div>
					</div>
				</div>
			</section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);
