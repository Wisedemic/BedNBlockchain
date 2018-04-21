import React, {	Component } from 'react';
import { connect } from 'react-redux';

import agent from '../../agent';

import {
  BOOKINGS_PAGE_LOADED,
  BOOKINGS_PAGE_UNLOADED
} from '../../actions';

const mapStateToProps = state => ({
  ...state.rooms,
	
});

const mapDispatchToProps = dispatch => ({
  onLoad: () => {
    const payload = agent.Bookings.byUserID();
    dispatch({ type: BOOKINGS_PAGE_LOADED, payload })
  },
  onUnload: () => dispatch({ type: BOOKINGS_PAGE_UNLOADED })
});

class Bookings extends Component {
  componentDidMount() {
    // this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="rooms" className="hero is-info is-bold is-fullheight">
        <div className="hero-body">
          <h2 className="title is-2">Bookings</h2>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);
