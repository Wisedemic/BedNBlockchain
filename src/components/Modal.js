import React, { Component } from 'react';

const Modal = props => {
  if (props.isActive) {
    return (
      <div className={'modal is-active'}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <button onClick={props.onClose} className="modal-close is-large" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            {props.content}
          </section>
          <div className="modal-card-foot">
            <div className="buttons">
              <button onClick={props.onClickConfirm} className={'button is-danger ' + (props.isLoading ? 'is-loading' : '')}>{props.confirmText}</button>
              <button onClick={props.onClose} className="button">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Modal;
