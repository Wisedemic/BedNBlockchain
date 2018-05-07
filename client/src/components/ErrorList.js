import React, { Component } from 'react';

class ErrorsList extends Component {

  render() {
    if (this.props.errors) {
      return this.props.errors.map((error, index) => {
				console.log(error, index);
        return (
          <div key={index} className="notification is-danger">
            <button className="delete" onClick={() => this.props.handleClose(index)} />
            <span>{error}</span>
          </div>
        );
      }, this);
    }
    return null;
  }
}

export default ErrorsList;
