import React from 'react';
import { Segment, Image, Header, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import './BCMap.css';

const MapBox = ReactMapboxGl({
	accessToken:
		'pk.eyJ1IjoiYnVybmNhcnRlbCIsImEiOiJjamN4MXN0dm4wdjVoMnFvNW5lMHU2NGI1In0.ZV6FeNJa2M1EFtEQegRRyQ'
});

const publisherLocationsToString = locationName => {
	// TODO move earlier in the chain so it's also in the map.
	if (locationName) {
		if (!locationName.includes(',')) {
			// Location only has one part - just return it as-is then.
			return locationName;
		} else {
			// Convert locationName to City, State or City, Country if possible.
			const parts = locationName
				.split(', ')
				.filter(part => part.match(/[a-z]/) && !part.includes('United States'));

			if (parts.length > 2) {
				return `${parts[0]}, ${parts.slice(-1)[0]}`;
			} else {
				return parts.join(', ');
			}
		}
	} else {
		return '';
	}
};

class BCMap extends React.Component {
	static getRandomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}

	state = {
		selectedFeature: null,
		center: [0, 0],
		zoom: [0]
	};

	onToggleHover(cursor, { map }) {
		map.getCanvas().style.cursor = cursor;
	}

	// add something here to set track from outside.. maybe have this be set at the App level.

	markerClick(selectedFeature, { feature }) {
		this.setState({
			center: feature.geometry.coordinates,
			zoom: [4],
			selectedFeature
		});
	}

	makeTrackFeatures() {
		return this.props.data.map(track => {
			return (
				<Feature
					key={track.track.id}
					coordinates={track.publisher.position}
					onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
					onMouseLeave={this.onToggleHover.bind(this, '')}
					onClick={this.markerClick.bind(this, {
						id: track.track.id,
						position: track.publisher.position,
						avatar_url: track.publisher.avatar_url,
						name: track.publisher.name,
						locationName: track.publisher.location
					})}
				/>
			);
		});
	}

	makeCuratorFeatures() {
		return this.props.data.map(soundcloudUser => {
			return (
				<Feature
					key={soundcloudUser.soundcloud_user.id}
					coordinates={soundcloudUser.location.position}
					onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
					onMouseLeave={this.onToggleHover.bind(this, '')}
					onClick={this.markerClick.bind(this, {
						id: soundcloudUser.soundcloud_user.id,
						position: soundcloudUser.location.position,
						avatar_url: soundcloudUser.soundcloud_user.avatar_url,
						name: soundcloudUser.soundcloud_user.name,
						locationName: soundcloudUser.location.name
					})}
				/>
			);
		});
	}

	render() {
		const { selectedFeature, zoom, center } = this.state;

		return (
			<Segment>
				<div className="BCMap-Container">
					<MapBox
						style="mapbox://styles/mapbox/dark-v9"
						zoom={zoom}
						dragRotate={false}
						center={center}
						containerStyle={{
							height: '100vh',
							width: '100vh'
						}}
					>
						<Layer
							type="symbol"
							id="marker"
							layout={{ 'icon-image': 'marker-15' }}
						>
							{this.props.featureType === 'track'
								? this.makeTrackFeatures()
								: this.makeCuratorFeatures()}
						</Layer>

						{selectedFeature && (
							<Popup
								key={selectedFeature.id}
								coordinates={selectedFeature.position}
							>
								<div>
									<span>{selectedFeature.name} </span>
								</div>
								<span> {publisherLocationsToString(selectedFeature.locationName)}</span>
								<Image src={selectedFeature.avatar_url} />
							</Popup>
						)}
					</MapBox>
				</div>
			</Segment>
		);
	}
}

const { instanceOf, string } = PropTypes;

BCMap.propTypes = {
	data: instanceOf(Array)
};

BCMap.defaultProps = {
	data: undefined
};

export default BCMap;
