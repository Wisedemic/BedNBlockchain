import React, { Component } from 'react';

class Loading extends Component {
  render() {
		return (
      <section id="loader" className="hero is-fullheight">
        <h2 className="title is-2">This will just take a moment...</h2>
        <img src={require('../assets/loader.gif')} alt="Loading..."/>
        <h2 className="subtitle is-2">Loading. . .</h2>
      </section>
    );
  }
}

export default Loading;
