import React, { Component } from 'react';

class ErrorsList extends Component {
  render() {
    if (this.props.errors) {
      return (
        <div className="notification is-danger">
          <button className="delete" onClick={this.props.handleClose}></button>
          {this.props.errors}
        </div>
      );
    }
    return null;
  }
}


export default ErrorsList;
