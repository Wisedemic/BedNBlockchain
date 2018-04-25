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
		switch (this.props.type) {
			case 'file':
				return (
					<div className="file is-info is-fullwidth">
						<label className="file-label">
							<input
								className="file-input"
								type="file"
								onChange={this.props.onChange}
							/>
							<span className="file-cta">
								<span className="file-icon">
									<i className="fa fa-upload"></i>
								</span>
								<span className="file-label">
					        Click To Upload
					      </span>
							</span>
							<span className="file-name">
								{this.props.value.name || ''}
							</span>
						</label>
					</div>
				);
      case 'location':
        return (
          <input type={this.props.type}
						className={'input' +
              (this.props.size ? ' '+ this.props.size : '') +
							(this.props.inputState ? ' ' + this.props.inputState : '') +
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
			case 'text':
      case 'number':
			case 'password':
			case 'email':
			case 'date':
				return (
					<input
						type={this.props.type}
						className={'input' +
              (this.props.size ? ' '+ this.props.size : '') +
							(this.props.inputState ? ' '+this.props.inputState : '') +
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
			case 'textarea':
				return (
					<textarea
						type={this.props.type}
						className={'textarea' +
              (this.props.size ? ' '+ this.props.size : '') +
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
      case 'select':
        return (
          <div
            className={'select' +
              (this.props.size ? ' '+ this.props.size : '') +
  						((this.props.inputState.length > 0) ? (' '+this.props.inputState) : '') +
  						(this.state.focus ? ' is-focused' : '') +
  						(this.state.hover ? ' is-hovered' : '')
  					}
            onMouseOver={this.onHover}
            onMouseLeave={this.offHover}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          >
            <select value={this.props.value} onChange={this.props.onChange}>
              {this.props.placeholder.length > 0 ? (<option value="" disabled>{this.props.placeholder}</option>) : (<option value="" disabled></option>)}
              {this.props.opts.map((key, val) => {
                return (<option key={val}>{key}</option>);
              })}
            </select>
          </div>
        );
      case 'incrementer':
        return (
          <div className="button is-static">{this.props.value}</div>
        );
			default:
				return null;
		}
  }
}

export default BulmaInput;
