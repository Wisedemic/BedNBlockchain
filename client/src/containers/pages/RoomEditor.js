import React, {	Component } from 'react';
import { connect } from 'react-redux';

import ErrorList from '../../components/ErrorList';
import Field from '../../components/Field';
import Room from '../../components/Room';

import agent from '../../agent';

import {
  LOAD_PAGE,
  UNLOAD_PAGE,
  ROOMS,
  ROOMEDITOR
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
  message: state.roomEditor.message,
  title: state.roomEditor.title,
  desc: state.roomEditor.desc,
  propertyType: state.roomEditor.propertyType,
  roomType: state.roomEditor.roomType,
  location: state.roomEditor.location,
  price: state.roomEditor.price,
  guests: state.roomEditor.guests,
	featuredImage: state.roomEditor.featuredImage
});

const mapDispatchToProps = dispatch => ({
  onLoad: (url) => {
    console.log(url);
    if (url.path === '/your-rooms/add') {
      dispatch({ type: LOAD_PAGE.ROOMEDITOR, mode: 'add' });
    } else if(url.params.roomId) {
      const payload = agent.Rooms.getRoom(url.params.roomId);
      dispatch({ type: LOAD_PAGE.ROOMEDITOR, mode: 'edit', payload });
    } else {
      // Something wrong
      console.log(url);
    }
  },
  onUnload: () =>	dispatch({ type: UNLOAD_PAGE.ROOMEDITOR }),
	closeError: (index) => dispatch({ type: ROOMEDITOR.CLOSE_ERROR, index: index }),
  handleSubmit: (userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId, mode, roomId) => {

    if (mode === 'edit') {
      const payload = agent.Rooms.editRoom(roomId, title, desc, propertyType, roomType, location, price, guests, featuredImageId);
      dispatch({ type: ROOMS.EDIT, payload });
    } else if (mode === 'add') {
      const payload = agent.Rooms.add(userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId);
      dispatch({ type: ROOMS.ADD, payload });
    }
  },
  onChangeTitle: value => {
		const key = 'title';
		if (value.length === 0) {
      dispatch(ROOMEDITOR.FieldError(key, 'Title cannot be blank!', 'is-danger', value));
		} else if (value.length < 6 || value.length > 90) {
      dispatch(ROOMEDITOR.FieldError(key, 'Title cannot be blank!', 'is-danger', value));
		} else {
			dispatch({ type: ROOMEDITOR.UPDATE_FIELD, key, value: value });
		}
	},
  onChangeDesc: value => {
		const key = 'desc';
		if (value.length === 0) {
      dispatch(ROOMEDITOR.FieldError(key, 'Description cannot be blank!', 'is-danger', value));
		} else if (value.length < 6 || value.length > 1000) {
      dispatch(ROOMEDITOR.FieldError(key, 'Must be between 6-1000 characters!', 'is-warning', value));
		} else {
			dispatch({ type: ROOMEDITOR.UPDATE_FIELD, key, value: value })
		}
	},
  onChangePropertyType: value => {
    const key = 'propertyType';
		if (!PropertyTypes.includes(value)) {
			dispatch(ROOMEDITOR.FieldError(key, 'NO TAMPERING FIELDS!', 'is-danger', value));
		} else {
			dispatch({ type: ROOMEDITOR.UPDATE_FIELD, key, value: value })
		}
  },
  onChangeHomeType: value => {
    const key = 'roomType';
    if (!HomeTypes.includes(value)) {
      dispatch(ROOMEDITOR.FieldError(key, 'NO TAMPERING FIELDS!', 'is-danger', value));
		} else {
			dispatch({ type: ROOMEDITOR.UPDATE_FIELD, key, value: value });
		}
  },
	incrementGuests: (guestType) => dispatch({ type: ROOMEDITOR.INCREMENT_GUESTS, guestType }),
  decrementGuests: (guestType) => dispatch({ type: ROOMEDITOR.DECREMENT_GUESTS, guestType }),
	onChangeLocation: (value) => {
    const key = 'location';
		if (value.length === 0) {
      dispatch(ROOMEDITOR.FieldError(key, 'Location cannot be blank!', 'is-danger', {formatted_address: ''}));
		} else {
			const payload = agent.Maps.findAddress(value);
			dispatch({ type: ROOMEDITOR.UPDATE_FIELD, key, value });
			dispatch({ type: ROOMEDITOR.FETCH_GMAPS_RESULTS, payload });
		}
  },
	onClickLocation: (value) => {
			dispatch({ type: ROOMEDITOR.UPDATE_LOCATION_FROM_SUGGESTION, value })
  },
	onChangePrice: (value) => {
    const key = 'price';
    if (!value || value === 0) {
      dispatch(ROOMEDITOR.FieldError(key, 'A price is required!', 'is-danger', value));
		} else if (value > 100000) {
        dispatch(ROOMEDITOR.FieldError(key, 'Price is too high!', 'is-warning', value));
    } else {
			dispatch({ type: ROOMEDITOR.UPDATE_FIELD, key, value: value })
		}
  },
	onChangeFeaturedImage: (file) => {
		const key = 'featuredImage';
		console.log(file);
		if (!file) {
			console.log('No File!');
			return;
		}
		if (file.size > 16000000) {
      dispatch(
        ROOMEDITOR.FieldError(
          key,
          'File size can be no larger than 16MB\'s',
          'is-danger',
          {file_id: '', file_name: '', image: ''}
        )
      );
		} else if (file.size < 20) {
      dispatch(
        RoomEditor(
          key,
          'Must upload a featured image!',
          'is-danger',
          {
  					file_id: '',
  					file_name: '',
  					image: ''
  				}
        )
      );
		} else {
			const formData = new FormData();
      formData.append('file', file);
			const payload = agent.Uploads.asyncFileUpload(formData);
			console.log('PAYLOAD', payload);
			dispatch({ type: ROOMEDITOR.UPLOAD_FEATURED_IMAGE, payload: payload});
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
    this.incrementGuests = type => this.props.incrementGuests(type);
    this.decrementGusts = type => this.props.decrementGuests(type);
		this.onChangeFeaturedImage = ev => this.props.onChangeFeaturedImage((ev.target.files[0]));

    this.submitForm = (title, desc, propertyType, roomType, location, price, guests, featuredImageId) => ev => {
      ev.preventDefault();
      // Don't send form if required fields aren't filled out.
      if (
        this.props.title.valid &&
        this.props.desc.valid &&
        this.props.propertyType.valid &&
        this.props.roomType.valid &&
        this.props.location.valid &&
        this.props.price.valid &&
				this.props.featuredImage.valid

      ) {
        if (this.props.match.params.roomId) {
          this.props.handleSubmit(this.props.userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId, this.props.mode, this.props.match.params.roomId);
        } else {
          this.props.handleSubmit(this.props.userId, title, desc, propertyType, roomType, location, price, guests, featuredImageId, this.props.mode);
        }
      }
    };
  }

  componentDidMount() {
		this.props.onLoad(this.props.match);
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
		const featuredImageId = this.props.featuredImage.value.file_id;
    const locationObj = this.props.location.value.formatted_address.split(', ');

    return (
      <section id="roomEditor" className="hero is-light is-bold is-fullheight">
        <div className="hero-body">
          <div className="container">
            <h2 className="title is-2">Add A Room</h2>
            <div className="box">
							<ErrorList handleClose={this.props.closeError} errors={this.props.errors} />
              <form onSubmit={this.submitForm(title, desc, propertyType, roomType, location, price, guests, featuredImageId)}>
								<div id="previewer" className="field is-horizontal">
                  <label className="field-label is-normal">Preview</label>
                  <div className="field-body">
                    <Room
                      preview={true}
                      title={this.props.title.value}
                      featuredImage={this.props.featuredImage.value.file_id}
                      roomType={this.props.roomType.value}
                      propertyType={this.props.propertyType.value}
                      price={this.props.price.value}
                      guests={this.props.guests.value}
                      location={locationObj}
                    />
									</div>
                </div>
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
                  label={'Max Adults'}
                  type={'incrementer'}
                  value={this.props.guests.value.adults}
                  isHorizontal={true}
                  hasAddonLeft={(<a className="button" onClick={() => this.props.incrementGuests('adults')}>+</a>)}
                  hasAddonRight={(<a className="button" onClick={() => this.props.decrementGuests('adults')}>-</a>)}
                />
                <Field
                  key={'children'}
                  label={'Max Children'}
                  type={'incrementer'}
                  value={this.props.guests.value.children}
                  isHorizontal={true}
                  hasAddonLeft={(<a className="button" onClick={() => this.props.incrementGuests('children')}>+</a>)}
                  hasAddonRight={(<a className="button" onClick={() => this.props.decrementGuests('children')}>-</a>)}
                />
                <Field
  								key={'featuredImage'}
  								label={'Featured Image'}
  								type={'file'}
  								value={this.props.featuredImage.value}
  								isLoading={this.props.featuredImage.loading}
  								isHorizontal={true}
  								onChange={this.onChangeFeaturedImage}
  								inputState={this.props.featuredImage.inputState}
  								message={this.props.featuredImage.message}
  							/>

								<div className="field">
									<p className="control">
										<button
											className={'button is-success' +
												(this.props.inProgress ? ' is-loading': '') +
												((this.props.title.valid &&
													this.props.desc.valid &&
													this.props.roomType.valid &&
													this.props.propertyType.valid &&
													this.props.location.valid &&
													this.props.price.valid &&
													this.props.featuredImage.valid) ?
													'' : ' is-outlined')
												}
											onClick={this.submitForm}
											disabled={
                        (this.props.title.valid &&
                          this.props.desc.valid &&
													this.props.roomType.valid &&
                          this.props.propertyType.valid &&
                          this.props.location.valid &&
                          this.props.price.valid &&
													this.props.featuredImage.valid) ?
													false : 'disabled'
												}
											>
											Submit
										</button>
                  </p>
                  <p className="help is-success">{this.props.message ? this.props.message : null}</p>
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
