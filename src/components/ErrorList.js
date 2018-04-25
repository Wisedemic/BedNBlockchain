import React, { Component } from 'react';

class ErrorsList extends Component {
  render() {
    console.log(this.props.errors);
    if (this.props.errors) {
      this.props.errors.map((error, index) => {
        return (
          <div key={index} className="notification is-danger">
            <button className="delete" onClick={this.props.handleClose} />
            <span>{this.props.errors[index]}</span>
          </div>
        );
      }, this);
    }
    return null;
  }
}

export default ErrorsList;
