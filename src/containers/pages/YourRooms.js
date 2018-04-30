import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import agent from '../../agent';

import {
  YOURROOMS_PAGE_LOADED,
  YOURROOMS_PAGE_UNLOADED,
  DELETE_ROOM,
  CLOSE_ERROR
} from '../../actions';

const mapStateToProps = state => ({
  yourRooms: state.rooms.yourRooms,
  userId: state.common.currentUser ? state.common.currentUser.id : null,
  loading: state.rooms.loading,
  reload: state.rooms.reload
});

const mapDispatchToProps = dispatch => ({
  onLoad: (userId) => {
    const payload = agent.Rooms.roomByUserId(userId);
    dispatch({ type: YOURROOMS_PAGE_LOADED, payload })
  },
  onUnload: () => dispatch({ type: YOURROOMS_PAGE_UNLOADED }),
  closeError: () => dispatch({ type: CLOSE_ERROR }),
  deleteRoom: (id) => {
    const payload = agent.Rooms.deleteRoom(id);
    dispatch({ type: DELETE_ROOM, payload });
  }
});

class YourRooms extends Component {
  constructor() {
    super();

    this.state = {
      isModalActive: false,
      roomId: ''
    };

    this.closeModal = () => {
      this.setState({isModalActive: false, roomId: ''});
    };

    this.activateModal = (roomId) => {
      this.setState({isModalActive: true, roomId: roomId});
    };

    this.editRoom = id => this.props.editRoom(id);
    this.deleteRoom = id => this.props.deleteRoom(id);
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
			<section id="yourRooms" className="hero is-light is-bold is-fullheight">
        {this.state.isModalActive ? (
          <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <button onClick={this.closeModal} className="modal-close is-large" aria-label="close"></button>
              </header>
              <section className="modal-card-body">
                Are you sure you would like to delete this room?
              </section>
              <div className="modal-card-foot">
                <div className="buttons">
                  <button onClick={() => this.props.deleteRoom(this.state.roomId)} className={'button is-danger ' + (this.props.loading ? 'is-loading' : '')}>DELETE</button>
                  <button onClick={this.closeModal} className="button">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
				<div className="hero-body">
					<div className="container has-text-centered">
						<h2 className="title is-2">Your Rooms</h2>
						<div className="rooms">
							{this.props.yourRooms.length > 0 ? (
								this.props.yourRooms.map((room, index) => {
									return (
										<div className="box" key={index}>
                      <figure className="image">
                        <img src={'http://localhost:3001/api/uploads/' + room.featuredImageId} alt="Placeholder image" />
                      </figure>
                      <div className="details">
                        <h5 className="title is-5">{room.title}</h5>
                        <h6 className="subtitle room-type is-6">{room.roomType} | {room.propertyType}</h6>
                      </div>
                      <p className="buttons">
                        <Link to={'/your-rooms/edit/'+room.id} className="button is-info"><span>Edit</span></Link>
                        <button onClick={() => this.activateModal(room.id)} className="button is-danger is-outlined">
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
                  <p className="content">You haven't added any rooms!</p>
                  <Link to="/your-rooms/add" className="button is-info">Add A Room</Link>
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
