import React, {	Component } from 'react';
import { connect } from 'react-redux';

import agent from '../../agent';

import {
  ROOMS_PAGE_LOADED,
  ROOMS_PAGE_UNLOADED
} from '../../actions';

const mapStateToProps = state => ({
  appName: state.common.appName,
  token: state.common.token,
  rooms: state.rooms
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
    console.log(this);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    // if (this.props.match.path.split['/'][1]) {
    //
    // }
    return (
			<section id="rooms" className="hero is-light is-fullheight">
        <div className="hero-body has-bg-img">
          <h2 className="title is-2">Rooms</h2>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
