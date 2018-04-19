import React, {	Component } from 'react';
import { connect } from 'react-redux';

import {
  LISTINGS_PAGE_LOADED,
  LISTINGS_PAGE_UNLOADED
} from '../../actions';

import Banner from '../assets/banner.jpg';

const mapStateToProps = state => ({
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onLoad: () =>
    dispatch({ type: LISTINGS_PAGE_LOADED }),
  onUnload: () =>
    dispatch({ type: LISTINGS_PAGE_UNLOADED })
});

class Listings extends Component {
  componentDidlMount() {
    this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
			<section id="listings" className="hero is-light is-fullheight">
        <div className="hero-body has-bg-img">
          <h2 className="title is-2">Listings</h2>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Listings);
