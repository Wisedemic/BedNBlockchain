import React from 'react';
import { Link } from 'react-router-dom';

const Room = props => {
  return (
    <div className={'card room ' + (props.preview ? 'preview' : '')}>
      {props.preview ? (
        <div className="card-image">
          <figure className="image is-4by3">
            <img src={props.featuredImage ? 'http://localhost:3001/api/uploads/' + props.featuredImage : 'https://bulma.io/images/placeholders/640x480.png'} alt="Placeholder" />
          </figure>
        </div>
      ) : (
        <Link to={'/room/' + props.roomId} className="card-image">
          <figure className="image is-4by3">
            <img src={props.featuredImage ? 'http://localhost:3001/api/uploads/' + props.featuredImage : 'https://bulma.io/images/placeholders/640x480.png'} alt="Placeholder" />
          </figure>
        </Link>
      )}
      <div className="card-content">
        <div className="details-header">
          <span style={{flexDirection: 'column'}}>
            <h5 className="title is-5">{props.title ? props.title : 'An Example Title!'}</h5>
            <h6 className="subtitle room-type is-6">{props.roomType ? props.roomType : 'Entire Place'} | {props.propertyType ? props.propertyType : 'Bungalow'}</h6>
          </span>
          <span className="price">{'$' + (props.price ? props.price : '0') + '/ Day'}</span>
        </div>
        <div className="details-body">
          <div className="location">
            <span>{(props.location[0] ? (props.location[0] + ', ' + props.location[1]) : 'Toronto, Canada')}</span>
          </div>
          <div className="guests">
            <span id="adult" className="guest"><i className="fa fa-male"></i><span>{props.guests.adults}</span></span>
            <span id="child" className="guest"><i className="fa fa-child"></i><span>{props.guests.children}</span></span>
          </div>
          {props.currentUser ? (
            props.currentUser.id !== props.ownerId ? (
              props.booked ? (
                <button className="button is-warning" disabled={'disabled'}>Booked!</button>
              ) : (
                <Link to={`/room/${props.roomId}`} className="button is-info">
                  Customize
                </Link>
              )
            ) : (
              <button className="button is-text" disabled={'disabled'}>You own this!</button>
            )
          ) : (
            props.preview ? (
              <button className="button is-primary" disabled={'disabled'}>Instant Book</button>
            ) : (
              <div>
                <a title="Signup Required!" className="button is-primary" disabled={'disabled'}>Instant Book</a>
                <p className="help is-danger">*Signup Required!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
