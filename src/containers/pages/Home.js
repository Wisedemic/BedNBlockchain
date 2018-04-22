import React, {	Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED
} from '../../actions';

import Banner from '../assets/banner.jpg';

const mapStateToProps = state => ({
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onLoad: () =>
    dispatch({ type: HOME_PAGE_LOADED }),
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED })
});

class Home extends Component {
  componentDidMount() {
    this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
		console.log(this.props);
    return (
			<div>
	      <section id="home" className="hero is-light is-fullheight">
					<div className="banner" style={{backgroundImage: 'url('+Banner+')'}}></div>
					<div className="hero-body">
						<div className="container has-text-centered">
		          <h1 className="title is-1">Find a Room, or List One</h1>
							<h4 className="subtitle is-4">{this.props.appName} does it all!</h4>
							<div className="columns is-mobile is-centered">
								<div className="column is-narrow">
									<div className="field has-addons">
									  <p className="control">
									    <Link className="button is-info is-outlined is-medium" to="/rooms">
									      <span>Book A Now</span>
									    </Link>
									  </p>
									  <p className="control">
									    <Link className="button is-danger is-outlined is-medium" to={(this.props.token > 16) ? '/your-rooms/add' : '/signup'}>
									      <span>List A Property</span>
									    </Link>
									  </p>
									</div>
								</div>
							</div>
						</div>
	        </div>
	      </section>
				<section id="featured" className="hero is-fullheight">
					<div className="hero-body">
						<div className="container has-text-centered">
							<h2 className="title is-2">Featured Rooms</h2>
							<div className="columns">
								<div className="column">Room #1</div>
								<div className="column">Room #2</div>
								<div className="column">Room #3</div>
							</div>
						</div>
					</div>
				</section>
			</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
