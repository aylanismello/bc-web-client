import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Grid, Card } from 'semantic-ui-react';
import SuperFilterPanel from './SuperFilterPanel';
import TrackList from '../TrackList';

class Feed extends React.Component {
	renderTracksMetadata() {
		return (
			<div>
				{' '}
				<div>This shows metadata specific to the super filter chosen.</div>
				<div>
					<SuperFilterPanel
						superFilters={[
							{
								name: 'Hot Mixes',
								filters: {
									date_range: 7,
									is_bc: false,
									page: 1,
									sort_type: 'hot',
									track_type: 2
								}
							},
							{
								name: 'BC Picks',
								filters: {
									date_range: 365,

									is_bc: true,
									page: 1,
									sort_type: 'latest',
									track_type: -1
								}
							},
							{
								name: 'Top Remixes',
								filters: {
									date_range: 7,
									is_bc: false,
									page: 1,
									sort_type: 'top',
									track_type: 1
								}
							},
							{
								name: 'Latest',
								filters: {
									date_range: 7,

									is_submission: false,
									page: 1,
									sort_type: 'latest',
									track_type: -1
								}
							}
						]}
						setFilters={this.props.setFilters}
					/>
				</div>
			</div>
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
	feedType: PropTypes.string.isRequired,
	setFilters: PropTypes.func.isRequired
};

export default Feed;
