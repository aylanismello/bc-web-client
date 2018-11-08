import React from 'react';
import PropTypes from 'prop-types';
import TabbedSegment from '../TabbedSegment';
import TrackList from '../TrackList';

// probably the SUPER FILTERS in the filter panel should be created SERVER Side,
// and we can update it whenever user logs in first time

class Feed extends React.Component {
	render() {
		return (
			<div className="Feed">
				{this.props.children}
				<TabbedSegment loading={this.props.loading}>
					<TrackList {...this.props} />
				</TabbedSegment>
			</div>
		);
	}
}

Feed.propTypes = {
	feedType: PropTypes.string.isRequired,
	setTrackFilters: PropTypes.func.isRequired
};

export default Feed;
