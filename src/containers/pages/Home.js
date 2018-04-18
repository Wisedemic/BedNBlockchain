import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED
} from '../../actions';

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
  componentDidlMount() {
    this.props.onLoad();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <section id="home" className="hero is-light is-fullheight">
        <div className="hero-body has-bg-img">
          <h2 className="title is-2">Homepage</h2>
        </div>
      </section>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
