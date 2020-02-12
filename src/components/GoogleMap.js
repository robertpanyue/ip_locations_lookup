import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import GMapMarker from './GMapMarker';
import { config } from '../../config';
const google = window.google;

const MapWithAMarker = withScriptjs(
	withGoogleMap((props) => (
		<GoogleMap defaultZoom={12} defaultCenter={{ lat: 40.7128, lng: -73.935242 }}>
			<Marker position={{ lat: props.data.lat, lng: props.data.lng }} />
		</GoogleMap>
	))
);

class GMaps extends Component {
	render() {
		const url =
			'https://maps.googleapis.com/maps/api/js?key=' +
			apiKey.googlemap +
			'&v=3.exp&libraries=geometry,drawing,places';
		return (
			<div style={{ height: '10px', width: '100%' }}>
				<MapWithAMarker
					googleMapURL={url}
					loadingElement={<div style={{ height: `100%` }} />}
					containerElement={<div style={{ height: `30rem` }} />}
					mapElement={<div style={{ height: `100%` }} />}
					data={this.props.data}
				/>
			</div>
		);
	}
}

export default GMaps;
