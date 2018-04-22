import React, { Component } from 'react';

import BulmaInput from './Input';

const Label = props => {
	if (!props.label) return null;
  if (props.label.length > 0 ) {
    return (
      <label className="label">{props.label}</label>
    );
	}
	return null;
}

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
        <Label label={this.props.label}/>

				{this.props.type === 'select' ? (
					<div className={'control'}>
	          <BulmaInput
	            onChange={this.props.onChange}
							opts={this.props.opts}
	            type={this.props.type}
	            placeholder={this.props.placeholder}
	            value={this.props.value}
	            disabled={this.props.disabled}
	            inputState={this.props.inputState}
	          />
				</div>
				) :
				(
					<p className={'control'}>
	          <BulmaInput
	            onChange={this.props.onChange}
							opts={this.props.opts}
	            type={this.props.type}
	            placeholder={this.props.placeholder}
	            value={this.props.value}
	            disabled={this.props.disabled}
	            inputState={this.props.inputState}
	          />
	        </p>
				)
				}
        <Message inputState={this.props.inputState} message={this.props.message}/>
      </div>
    );
  }
}

export default BulmaField;
