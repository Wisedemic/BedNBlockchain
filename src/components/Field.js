import React, { Component } from 'react';

import BulmaInput from './Input';

const Label = props => {
	if (!props.label) return null;
  if (props.label) {
    return (
      <label className={props.className}>{props.label}</label>
    );
	}
	return null;
}

const Message = props => {
  if (props.message) {
    return (
      <p className={'help ' + props.inputState}>{props.message}</p>
    );
  }
  return null;
};

const FieldWrapper = props => {
	if (props.isHorizontal) {
		return (
			<div className={'field is-horizontal'}>
				{props.label ? (<Label label={props.label} className="field-label is-normal" />) : null}
				<div className="field-body">
					<div className={'field is-expanded'}>
						<div className={'field' + (props.hasAddonLeft || props.hasAddonRight ? ' has-addons' : '')}>
							{props.children}
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className={'field' + (props.hasAddonLeft || props.hasAddonRight ? ' has-addons' : '')}>
				{props.label ? (<Label label={props.label} className="label" />) : null}
				{props.children}
			</div>
		);
	}
}

class BulmaField extends Component {

  render() {
		return (
			<FieldWrapper
				label={this.props.label ? this.props.label : null}
				hasAddonLeft={this.props.hasAddonLeft}
				hasAddonRight={this.props.hasAddonRight}
				isHorizontal={this.props.isHorizontal}
				inputState={this.props.inputState}
				message={this.props.message}
			>
				{this.props.hasAddonLeft ? (
					<div className="control">
						{this.props.hasAddonLeft}
					</div>
				) : null}
				<div className={'control' +
					(this.props.size ? ' '+ this.props.size : '') +
					(this.props.hasIconRight ? ' has-icons-right' : '') +
					(this.props.hasIconLeft ? ' has-icons-left' : '') +
					(this.props.isLoading ? ' is-loading' : '')
				}>
					<BulmaInput
						onChange={this.props.onChange}
						opts={this.props.opts}
						type={this.props.type}
						size={this.props.size}
						placeholder={this.props.placeholder}
						value={this.props.value}
						disabled={this.props.disabled}
						inputState={this.props.inputState}
						results={this.props.results}
					/>
					{this.props.type === 'search' ? (
						this.props.results ?
						(
							<div className="results">
								{this.props.results.map((room, index) => {
									const searchObj = {
										resultId: index,
									}
									return (
										<div
											key={index}
											className="suggestion"
											onClick={() => this.props.onClick(room.resultId)}
										>
										</div>
									);
								}, this)}
							</div>
						) : null
					) : null}
					{(this.props.results) ? (
						<div className="results">
							{this.props.results.map((result, key) => {

								const locationObj = {
									resultId: key,
									lat: result.geometry.location.lat,
									lng: result.geometry.location.lng,
									formatted_address: result.formatted_address
								}
								return (<div key={key} className="suggestion" onClick={() => this.props.onClick(locationObj)}>{locationObj.formatted_address}</div>);
							}, this)}
						</div>
					) : (
						null
					) }
					{this.props.hasIconLeft ? (
						<span className={'icon is-left'}>
							<i className={'fa fa-' + this.props.hasIconLeft}></i>
						</span>
					) : null}
					{this.props.hasIconRight ? (
						<span className={'icon is-right'}>
							<i className={'fa fa-' + this.props.hasIconRight}></i>
						</span>
					) : null}
					<Message inputState={this.props.inputState} message={this.props.message}/>
				</div>
				{this.props.hasAddonRight ? (
					<p className="control">
						{this.props.hasAddonRight}
					</p>
				) : null}

			</FieldWrapper>
    );
  }
}

export default BulmaField;
