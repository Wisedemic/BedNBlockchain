import React from 'react';

const GlobalErrors = props => {
	if (props.errors && props.handleClose) {
		return props.errors.map((error, index) => {
			return(
				<div key={index} id="global" className="notification is-danger">
					<button onClick={() => props.handleClose} className="delete"></button>
					{error}
				</div>
			);
		});
	}
	return null;
};

export default GlobalErrors;
