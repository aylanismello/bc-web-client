import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Grid, Card } from 'semantic-ui-react';
import SuperFilterButton from './SuperFilterButton';
import TrackList from '../TrackList';

class Feed extends React.Component {
	renderTracksMetadata() {
		return (
			<Segment>
				{' '}
				<Segment>
					This shows metadata specific to the super filter chosen.
				</Segment>
				<Segment>
					<Card.Group>
						<SuperFilterButton setFilters={this.props.setFilters} />
						<SuperFilterButton setFilters={this.props.setFilters} />
						<SuperFilterButton setFilters={this.props.setFilters} />
						<SuperFilterButton setFilters={this.props.setFilters} />
						<SuperFilterButton setFilters={this.props.setFilters} />
						<SuperFilterButton setFilters={this.props.setFilters} />
					</Card.Group>
				</Segment>
				{Object.keys(this.props.trackFilters).map(daFilter => (
					<p>
						{daFilter} : {this.props.trackFilters[daFilter]}
					</p>
				))}{' '}
			</Segment>
		);
	}

	renderMetadata() {
		if (this.props.feedType === 'tracks') {
			return this.renderTracksMetadata();
		}

		return null;
	}

	render() {
		return <TrackList {...this.props}> {this.renderMetadata()} </TrackList>;
	}
}

Feed.propTypes = {
	feedType: PropTypes.string.isRequired
};

export default Feed;
