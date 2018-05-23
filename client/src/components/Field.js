import React, { Component } from 'react';

import BulmaInput from './Input';

// Wrap the Label for cleaner syntax in the Field Component
const Label = props => {
	if (!props.label) return null;
  if (props.label) {
    return (
      <label className={props.className}>{props.label}</label>
    );
	}
	return null;
}

// Wrap the message and apply the inputState for styles
const Message = props => {
  if (props.message) {
    return (
      <p className={'help ' + props.inputState}>{props.message}</p>
    );
  }
  return null;
};

/*
*		Define a Wrapper component that will change the appearance
* 	of the form based on props provided.
*		{
*			isHorizontal: Boolean, // this makes the form horizontal
*			children: Component // this injects the field into the styled form
*		}
*/
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
					) : (
					null
				)}

				{/*
						The 'control' class element wraps
						all inputs to create an easier way to manipulate and
						shape forms.
				*/}
				<div className={'control' +
					(this.props.size ? ' '+ this.props.size : '') +
					(this.props.hasIconRight ? ' has-icons-right' : '') +
					(this.props.hasIconLeft ? ' has-icons-left' : '') +
					(this.props.isLoading ? ' is-loading' : '')
				}>
					{/* Display the input field with props*/}
					<BulmaInput
						type={this.props.type}
						size={this.props.size}
						placeholder={this.props.placeholder}
						value={this.props.value}
						disabled={this.props.disabled}
						inputState={this.props.inputState}
						onChange={this.props.onChange}
						onClick={this.props.onClick}
						active={this.props.active}
						results={this.props.results}
						opts={this.props.opts}
					/>

					{/*
							If this component has a results prop,
							display the results beneath the component.
							MODIFIED*** If the type prop is 'search',
							a custom click event is run.
					*/}
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
											onClick={() => this.props.onClick(searchObj.resultId)}
										>
										</div>
									);
								}, this)}
							</div>
						) : null
					) : (
						null
					)}

					{/*
							If this component has a results prop,
							display the results beneath the component.
					*/}
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
					)}

					{/* If an font-awesome icon was provided. */}
					{this.props.hasIconLeft ? (
						<span className={'icon is-left'}>
							<i className={'fa fa-' + this.props.hasIconLeft}></i>
						</span>
					) : (
						null
					)}
					{this.props.hasIconRight ? (
						<span className={'icon is-right'}>
							<i className={'fa fa-' + this.props.hasIconRight}></i>
						</span>
					) : (
						null
					)}

					{/* A message that displays beneath the input field. */}
					<Message inputState={this.props.inputState} message={this.props.message}/>
				</div>

				{/* If A left addon prop was provided. */}
				{this.props.hasAddonRight ? (
					<div className="control">
						{this.props.hasAddonRight}
					</div>
				) : (
					null
				)}
				{/* END OF FIELD COMPONENT*/}
			</FieldWrapper>
    );
  }
}

export default BulmaField;
