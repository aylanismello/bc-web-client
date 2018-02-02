import React from 'react';
import { Segment, Image, Header, Divider } from 'semantic-ui-react';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import './BCMap.css';

const MapBox = ReactMapboxGl({
	accessToken:
		'pk.eyJ1IjoiYnVybmNhcnRlbCIsImEiOiJjamN4MXN0dm4wdjVoMnFvNW5lMHU2NGI1In0.ZV6FeNJa2M1EFtEQegRRyQ'
});

const publisherLocationsToString = ({ location }) => {
	// TODO move earlier in the chain so it's also in the map.
	if (location) {
		if (!location.includes(',')) {
			// Location only has one part - just return it as-is then.
			return location;
		} else {
			// Convert location to City, State or City, Country if possible.
			const parts = location.split(', ').filter(part =>
				part.match(/[a-z]/) && !part.includes('United States')
			);

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
		track: null,
		center: [0, 0],
		zoom: [0]
	};

	onToggleHover(cursor, { map }) {
		map.getCanvas().style.cursor = cursor;
	}

	// add something here to set track from outside.. maybe have this be set at the App level.

	markerClick(track, { feature }) {
		console.log(track);
		this.setState({
			center: feature.geometry.coordinates,
			zoom: [4],
			track
		});
	}

	render() {
		const { track, zoom, center } = this.state;

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
							{this.props.tracks.map(track => {
								return (
									<Feature
										key={track.track.id}
										coordinates={track.publisher.position}
										onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
										onMouseLeave={this.onToggleHover.bind(this, '')}
										onClick={this.markerClick.bind(this, track)}
									/>
								);
							})}
						</Layer>

						{track && (
							<Popup
								key={track.track.id}
								coordinates={track.publisher.position}
							>
								<div>
									<span>{track.publisher.name} </span>
								</div>
								<span>
									{' '}
									{publisherLocationsToString(track.publisher)}
								</span>
								<Image src={track.publisher.avatar_url} />
							</Popup>
						)}
					</MapBox>
				</div>
			</Segment>
		);
	}
}

export default BCMap;
