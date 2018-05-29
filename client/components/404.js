import React from 'react';
import { Link } from 'react-router-dom';

export default class Four_Oh_Four extends React.Component {
  componentWillMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <section id="404" className="hero is-dark is-bold is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-1">Uh oh! This page was not found!</h1>
            <br />
            <Link className="button is-info is-large" to="/">
              Return Home
            </Link>
          </div>
        </div>
      </section>
    );
  }
}
