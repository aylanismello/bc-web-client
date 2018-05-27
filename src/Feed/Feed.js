import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Grid, Card } from 'semantic-ui-react';
import { mainFilters } from '../filter_helpers';
import SuperFilterPanel from './SuperFilterPanel';
import TrackList from '../TrackList';

// probably the SUPER FILTERS in the filter panel should be created SERVER Side,
// and we can update it whenever user logs in first time

class Feed extends React.Component {
	render() {
		return (
			<div className="Feed">
				{this.props.children}
				{/* {this.renderMetadata()} */}
				<TrackList {...this.props} />
			</div>
		);
	}
}

Feed.propTypes = {
	feedType: PropTypes.string.isRequired,
	setTrackFilters: PropTypes.func.isRequired
};

export default Feed;
