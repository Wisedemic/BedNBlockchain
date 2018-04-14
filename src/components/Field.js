import React, { Component } from 'react';

import BulmaInput from './Input';
const Message = props => {
  if (props.message.length > 0) {
    return (
      <p className={'help ' + props.inputState}>{props.message}</p>
    );
  } else {
    return null;
  }
};


class BulmaField extends Component {

  render() {
    return (
      <div className="field">
        <p className={'control'}>
          <BulmaInput
            onChange={this.props.onChange}
            type={this.props.type}
            placeholder={this.props.placeholder}
            value={this.props.value}
            disabled={this.props.disabled}
            inputState={this.props.inputState}
          />
        </p>
        <Message inputState={this.props.inputState} message={this.props.message}/>
      </div>
    );
  }
}

export default BulmaField;
