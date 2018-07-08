import React from 'react';
import {
	Segment,
	Image,
	Item,
	Header,
	Divider,
	Dimmer,
	Loader
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
	publisherLocationsToString,
	formatSoundcloudUserForMap
} from '../helpers';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import './BCMap.css';

const MapBox = ReactMapboxGl({
	accessToken:
		'pk.eyJ1IjoiYnVybmNhcnRlbCIsImEiOiJjamN4MXN0dm4wdjVoMnFvNW5lMHU2NGI1In0.ZV6FeNJa2M1EFtEQegRRyQ'
});

class BCMap extends React.Component {
	static getRandomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}

	state = {
		selectedFeature: null,
		center: [0, 0],
		zoom: [0]
	};

	componentWillUpdate(nextProps) {
		if (
			this.props.data &&
			this.props.data[0] &&
			this.props.isSingleUser &&
			(JSON.stringify(this.state.center) === JSON.stringify([0, 0]) ||
				nextProps.data[0].location.position !==
					this.props.data[0].location.position)
		) {
			this.setState({
				center: nextProps.data[0].location.position.map(coordinate =>
					parseInt(coordinate)
				)
			});
		}
	}

	onToggleHover(cursor, { map }) {
		map.getCanvas().style.cursor = cursor;
	}

	curatorsWithPosition() {
		return this.props.data
			.filter(curator => curator.location.id)
			.map(curator => {
				return formatSoundcloudUserForMap(curator);
			});
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
						soundcloud_user_id: track.publisher.id,
						name: track.publisher.name,
						locationName: track.publisher.location
					})}
				/>
			);
		});
	}

	makeCuratorFeatures() {
		return this.curatorsWithPosition().map(soundcloudUser => {
			// return this.props.data.map(soundcloudUser => {
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
		// const width = this.props.size === 'small' ? '25vh' : '100vh';
		const width = `${this.props.size}vh`;
		const { isSingleUser } = this.props;

		return (
			<Dimmer.Dimmable
				as={isSingleUser ? Item : Segment}
				dimmed={this.props.loading}
			>
				<Dimmer active={this.props.loading} inverted>
					<Loader> Loading </Loader>
				</Dimmer>
				<div className="BCMap-Container">
					<MapBox
						style="mapbox://styles/mapbox/dark-v9"
						zoom={zoom}
						dragRotate={false}
						center={center}
						containerStyle={{
							height: width,
							width
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
								className="BCMap-Popup-Container"
								key={selectedFeature.id}
								coordinates={selectedFeature.position}
								onClick={() =>
									(window.location = `#/soundcloud_users/${this.props
										.featureType === 'track'
										? selectedFeature.soundcloud_user_id
										: selectedFeature.id}`)}
							>
								<div>
									<span>{selectedFeature.name} </span>
								</div>
								<span>
									{' '}
									{publisherLocationsToString(selectedFeature.locationName)}
								</span>
								<Image src={selectedFeature.avatar_url} size="mini" />{' '}
							</Popup>
						)}
					</MapBox>
				</div>
			</Dimmer.Dimmable>
		);
	}
}

const { instanceOf, string, bool } = PropTypes;

BCMap.propTypes = {
	data: instanceOf(Array),
	isSingleUser: bool
};

BCMap.defaultProps = {
	data: undefined,
	isSingleUser: false
};

export default BCMap;
