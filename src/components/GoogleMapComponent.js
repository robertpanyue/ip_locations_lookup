import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { config } from '../config';
const google = window.google;

const MapWithAMarker = withScriptjs(
	withGoogleMap((props) => (
		<GoogleMap
			defaultZoom={12}
			center={{ lat: parseFloat(props.data.latitude), lng: parseFloat(props.data.longitude) }}
		>
			<Marker position={{ lat: parseFloat(props.data.latitude), lng: parseFloat(props.data.longitude) }} />
		</GoogleMap>
	))
);

class GoogleMapComponent extends Component {
	render() {
		console.log(this.props.data);
		const url =
			'https://maps.googleapis.com/maps/api/js?key=' +
			config.googlemap +
			'&v=3.exp&libraries=geometry,drawing,places';
		return (
			<div style={{ height: '50%', width: '100%' }}>
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

export default GoogleMapComponent;
