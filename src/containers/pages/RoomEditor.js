import React, {	Component } from 'react';
import { connect } from 'react-redux';

import ErrorList from '../../components/ErrorList';
import Field from '../../components/Field';

import agent from '../../agent';

import {
  ADD_ROOM,
  ROOMEDITOR_PAGE_LOADED,
  ROOMEDITOR_PAGE_UNLOADED,
  UPDATE_ROOMEDITOR_FIELD,
	FETCH_GMAPS_RESULTS,
	UPDATE_LOCATION_FROM_SUGGESTION,
  ROOMEDITOR_FIELD_ERROR,
  CLOSE_ERROR,
  INCREMENT_ROOMEDITOR_GUESTS,
  DECREMENT_ROOMEDITOR_GUESTS
} from '../../actions';

const HomeTypes = [
  'Entire Place',
  'Private Room',
  'Shared Room'
];
const PropertyTypes = [
  'House',
  'Bed and Breakfast',
  'Bungalow',
  'Chalet',
  'Cottage',
  'Guesthouse',
  'Guest suite',
  'Hotel',
  'Resort',
  'Loft',
  'Townhouse',
  'Villa'
];

const mapStateToProps = state => ({
  ...state,
  userId: state.common.currentUser.id,
	mode: state.roomEditor.mode,
  title: state.roomEditor.title,
  desc: state.roomEditor.desc,
  propertyType: state.roomEditor.propertyType,
  roomType: state.roomEditor.roomType,
  location: state.roomEditor.location,
  price: state.roomEditor.price,
  guests: state.roomEditor.guests
});

const mapDispatchToProps = dispatch => ({
  onLoad: (url) => {
		const mode = (url === '/your-rooms/add') ? 'add' : 'edit';
    dispatch({ type: ROOMEDITOR_PAGE_LOADED, mode });
  },
  onUnload: () => dispatch({ type: ROOMEDITOR_PAGE_UNLOADED }),
	closeError: () =>	dispatch({ type: CLOSE_ERROR }),
  handleSubmit: (userId, title, desc, propertyType, roomType, location, price, guests) => {
    const payload = agent.Rooms.add(userId, title, desc, propertyType, roomType, location, price, guests);
    console.log('PAYLOAD', payload);
    dispatch({ type: ADD_ROOM, payload });
  },
  onChangeTitle: value => {
		const key = 'title';
		if (value.length === 0) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'Title cannot be blank!',
				inputState: 'is-danger',
				value: value
			});
		} else if (value.length < 6 || value.length > 140) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'Must be between 4-140 characters!',
				inputState: 'is-warning',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_ROOMEDITOR_FIELD, key: key, value: value });
		}
	},
  onChangeDesc: value => {
		const key = 'desc';
		if (value.length === 0) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'Description cannot be blank!',
				inputState: 'is-danger',
				value: value
			});
		} else if (value.length < 6 || value.length > 500) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'Must be between 6-500 characters!',
				inputState: 'is-warning',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_ROOMEDITOR_FIELD, key: key, value: value })
		}
	},
  onChangePropertyType: value => {
    const key = 'propertyType';
		if (!PropertyTypes.includes(value)) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'NO TAMPERING FIELDS!',
				inputState: 'is-danger',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_ROOMEDITOR_FIELD, key: key, value: value })
		}
  },
  onChangeHomeType: value => {
    const key = 'roomType';
    if (!HomeTypes.includes(value)) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'NO TAMPERING FIELDS!',
				inputState: 'is-danger',
				value: value
			});
		} else {
			dispatch({ type: UPDATE_ROOMEDITOR_FIELD, key: key, value: value });
		}
  },
	incrementGuests: (guestType) => dispatch({ type: INCREMENT_ROOMEDITOR_GUESTS, guestType }),
  decrementGuests: (guestType) => dispatch({ type: DECREMENT_ROOMEDITOR_GUESTS, guestType }),
	onChangeLocation: (value) => {
    const key = 'location';
		if (value.length === 0) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'Location cannot be blank!',
				inputState: 'is-danger',
				value: {formatted_address: ''}
			});
		} else {
			const payload = agent.Maps.findAddress(value);
			dispatch({ type: FETCH_GMAPS_RESULTS, payload });
			dispatch({ type: UPDATE_ROOMEDITOR_FIELD, key, value });
		}
  },
	onClickLocation: (value) => {
			dispatch({ type: UPDATE_LOCATION_FROM_SUGGESTION, value })
  },
	onChangePrice: (value) => {
    const key = 'price';
    if (!value || value === 0) {
			dispatch({
				type: ROOMEDITOR_FIELD_ERROR,
				key: key,
				message: 'A price is required!',
				inputState: 'is-danger',
				value: value
			});
		} else if (value > 100000) {
  			dispatch({
  				type: ROOMEDITOR_FIELD_ERROR,
  				key: key,
  				message: 'Price is too high!',
  				inputState: 'is-warning',
  				value: value
  			});
    } else {
			dispatch({ type: UPDATE_ROOMEDITOR_FIELD, key: key, value: value })
		}
  }
});

class RoomEditor extends Component {
  constructor() {
    super();
    this.onChangeTitle = ev => this.props.onChangeTitle(ev.target.value);
    this.onChangeDesc = ev => this.props.onChangeDesc(ev.target.value);
    this.onChangePropertyType = ev => this.props.onChangePropertyType(ev.target.value);
    this.onChangeHomeType = ev => this.props.onChangeHomeType(ev.target.value);
		this.onChangeLocation = ev => this.props.onChangeLocation(ev.target.value);
		this.onClickLocation = value => this.props.onClickLocation(value);
    this.onChangePrice = ev => this.props.onChangePrice(ev.target.value);
    this.onChangeGusts = value => this.props.onChangeGuests(value);

    this.incrementGuests = type => this.props.incrementGuests(type);
    this.decrementGusts = type => this.props.decrementGuests(type);

    this.submitForm = (title, desc, propertyType, roomType, location, price, guests) => ev => {
      ev.preventDefault();
      // Don't send form if required fields aren't filled out.
      if (
        this.props.title.valid &&
        this.props.desc.valid &&
        this.props.propertyType.valid &&
        this.props.roomType.valid &&
        this.props.location.valid &&
        this.props.price.valid
      ) {
        this.props.handleSubmit(this.props.userId, title, desc, propertyType, roomType, location, price, guests);
      }
    };
  }

  componentDidMount() {
		this.props.onLoad(this.props.match.url);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const title = this.props.title.value;
    const desc = this.props.desc.value;
    const propertyType = this.props.propertyType.value;
		const roomType = this.props.roomType.value;
		const location = this.props.location.value;
    const price = this.props.price.value;
		const guests = this.props.guests.value;

    return (
      <section id="rooms" className="hero is-light is-bold is-fullheight">
        <div className="hero-body">
          <div className="container">
            <h2 className="title is-2">Add A Room</h2>
            <div className="box">
							<ErrorList handleClose={this.props.closeError} errors={this.props.errors} />
              <form onSubmit={this.submitForm(title, desc, propertyType, roomType, location, price, guests)}>
                <Field
									key={'title'}
									type={'text'}
                  label={'Title'}
									value={this.props.title.value}
                  isHorizontal={true}
									placeholder={'A Stunning Two Bedroom Home!'}
									onChange={this.onChangeTitle}
									inputState={this.props.title.inputState}
									message={this.props.title.message}
								/>
								<Field
									key={'desc'}
                  label={'Description'}
									type={'textarea'}
									value={this.props.desc.value}
                  isHorizontal={true}
									placeholder={'This gorgeous home has everything you need...'}
									onChange={this.onChangeDesc}
									inputState={this.props.desc.inputState}
									message={this.props.desc.message}
								/>
                <Field
                  key={'propertyType'}
                  label={'Property Type'}
                  type={'select'}
                  value={this.props.propertyType.value}
                  opts={PropertyTypes}
                  isHorizontal={true}
                  placeholder={'Please Select'}
                  onChange={this.onChangePropertyType}
                  inputState={this.props.propertyType.inputState}
                  message={this.props.propertyType.message}
                />
                <Field
                  key={'roomType'}
                  label={'Home Type'}
                  type={'select'}
                  value={this.props.roomType.value}
                  opts={HomeTypes}
                  placeholder={'Please Select'}
                  isHorizontal={true}
                  onChange={this.onChangeHomeType}
                  inputState={this.props.roomType.inputState}
                  message={this.props.roomType.message}
                />
                <Field
                  key={'location'}
                  label={'Location'}
                  type={'location'}
                  size={'is-medium'}
                  value={this.props.location.value.formatted_address}
                  placeholder={'Type the address to search...'}
                  isHorizontal={true}
                  hasIconLeft={'search'}
                  onChange={this.onChangeLocation}
									onClick={this.onClickLocation}
                  inputState={this.props.location.inputState}
                  message={this.props.location.message}
									results={this.props.location.results}
                  isLoading={this.props.location.loading}
                />
                <Field
                  key={'price'}
                  label={'Price'}
                  type={'number'}
                  value={this.props.price.value}
                  isHorizontal={true}
                  hasAddonLeft={(<a className="button is-static">$</a>)}
                  hasAddonRight={(<a className="button is-static">/ Day</a>)}
                  placeholder={'180'}
                  onChange={this.onChangePrice}
                  inputState={this.props.price.inputState}
                  message={this.props.price.message}
                />

                <Field
                  key={'adults'}
                  label={'Adults'}
                  type={'incrementer'}
                  value={this.props.guests.value.adults}
                  isHorizontal={true}
                  hasAddonLeft={(<a className="button" onClick={() => this.props.incrementGuests('adults')}>+</a>)}
                  hasAddonRight={(<a className="button" onClick={() => this.props.decrementGuests('adults')}>-</a>)}
                />
                <Field
                  key={'children'}
                  label={'Children'}
                  type={'incrementer'}
                  value={this.props.guests.value.children}
                  isHorizontal={true}
                  hasAddonLeft={(<a className="button" onClick={() => this.props.incrementGuests('children')}>+</a>)}
                  hasAddonRight={(<a className="button" onClick={() => this.props.decrementGuests('children')}>-</a>)}
                />
                <Field
                  key={'infants'}
                  label={'Infants'}
                  type={'incrementer'}
                  value={this.props.guests.value.infants}
                  isHorizontal={true}
                  hasAddonLeft={(<a className="button" onClick={() => this.props.incrementGuests('infants')}>+</a>)}
                  hasAddonRight={(<a className="button" onClick={() => this.props.decrementGuests('infants')}>-</a>)}
                />
								<div className="field">
									<p className="control">
										<button
											className={'button is-success' + (this.props.inProgress ? ' is-loading': '') + ((this.props.title.valid && this.props.desc.valid) ? '' : ' is-outlined')}
											onClick={this.submitForm}
											disabled={
                        (
                          this.props.title.valid &&
                          this.props.desc.valid &&
                          this.props.propertyType.valid &&
                          this.props.roomType.valid &&
                          this.props.location.valid &&
                          this.props.price.valid
                        )
                         ? false : 'disabled'}
											>
											Submit
										</button>
                  </p>
								</div>
							</form>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomEditor);
