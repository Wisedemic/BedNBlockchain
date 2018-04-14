import React, { Component } from 'react';

class BulmaInput extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onHover = this.onHover.bind(this);
    this.offHover = this.offHover.bind(this);
    this.state = {
      focused: false,
      hover: false
    }
  }
  onFocus() {
    this.setState({focused: true});
  }
  onBlur() {
    this.setState({focused: false});
  }
  onHover() {
    this.setState({hover: true});
  }
  offHover() {
    this.setState({hover: false})
  }
  render() {
    return (
      <input
        type={this.props.type}
        className={'input' +
          (this.props.inputState.length > 0 ? ' ' + this.props.inputState : '') +
          (this.state.focus ? ' is-focused' : '') +
          (this.state.hover ? ' is-hovered' : '')
        }
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        onMouseOver={this.onHover}
        onMouseLeave={this.offHover}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        />
    );
  }
}

export default BulmaInput;
