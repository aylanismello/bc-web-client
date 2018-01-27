import React from 'react';
import './BCMap.css';
import { Segment, Image } from 'semantic-ui-react';

import ReactMapboxGl, { Layer, Feature, Popup, StyledPopup } from 'react-mapbox-gl';

const MapBox = ReactMapboxGl({
	accessToken:
		'pk.eyJ1IjoiYnVybmNhcnRlbCIsImEiOiJjamN4MXN0dm4wdjVoMnFvNW5lMHU2NGI1In0.ZV6FeNJa2M1EFtEQegRRyQ'
});

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
		this.setState({
			center: feature.geometry.coordinates,
			zoom: [4],
			track
		});
	}

	render() {
		const { track, zoom, center } = this.state;
		// const tracksWithFakePosition =
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
						<Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
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
							<Popup key={track.track.id} coordinates={track.publisher.position}>
								<div>
									<span>{track.publisher[0].name} </span>
								</div>
								<span>
									{' '}
									{track.publisher[0].city} , {track.publisher[0].county}{' '}
								</span>
								<Image src={track.publisher[0].avatar_url} />
								{/* <StyledPopup>
								<div>{track.track.name}</div>
							</StyledPopup> */}
							</Popup>
						)}
					</MapBox>
				</div>
			</Segment>
		);
	}
}

export default BCMap;
