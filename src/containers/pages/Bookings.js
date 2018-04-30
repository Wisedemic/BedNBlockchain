import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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
        {this.state.isModalActive ? (
          <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <button onClick={this.closeModal} className="modal-close is-large" aria-label="close"></button>
              </header>
              <section className="modal-card-body">
                Are you sure you would like to delete this booking?
              </section>
              <div className="modal-card-foot">
                <div className="buttons">
                  <button onClick={() => this.props.deleteBooking(this.state.bookingId)} className={'button is-danger ' + (this.props.loading ? 'is-loading' : '')}>DELETE</button>
                  <button onClick={this.closeModal} className="button">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
				<div className="hero-body">
					<div className="container has-text-centered">
						<h2 className="title is-2">Your Bookings</h2>
						<div className="bookings">
							{this.props.yourBookings.length > 0 ? (
								this.props.yourBookings.map((booking, index) => {
									return (
										<div className="box" key={index}>
                      <figure className="image">
                        <img src={'http://localhost:3001/api/uploads/' + booking.featuredImageId} alt="Placeholder image" />
                      </figure>
                      <div className="details">
                        <h5 className="title is-5">{booking.title}</h5>
                        <h6 className="subtitle booking-type is-6">{booking.bookingType} | {booking.propertyType}</h6>
                      </div>
                      <p className="buttons">
                        <Link to={'/your-bookings/edit/'+booking.id} className="button is-info"><span>Edit</span></Link>
                        <button onClick={() => this.activateModal(booking.id)} className="button is-danger is-outlined">
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
                <div className="box has-text-centered" style={{flexDirection: 'column'}}>
                  <p className="content">You haven't added any bookings!</p>
                  <Link to="/your-bookings/add" className="button is-info">Add A Booking</Link>
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
