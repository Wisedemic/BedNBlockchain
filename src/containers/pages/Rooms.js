import React, {	Component } from 'react';
import { connect } from 'react-redux';

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
			<section id="browse" className="hero is-fullheight">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h2 className="title is-2">Browse Rooms</h2>
							<div id="rooms">
								{this.props.roomsList ? (
									this.props.roomsList.map((room, index) => {
										return (
											<div className="card room" key={index}>
												<div class="card-image">
											    <figure class="image is-4by3">
											      <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
											    </figure>
											  </div>
												<div class="card-content">
													<div class="content">
														<h4 className="title is-4">{room.title}</h4>
														{room.description}
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
