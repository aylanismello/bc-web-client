import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Grid, Card } from 'semantic-ui-react';
import SuperFilterPanel from './SuperFilterPanel';
import TrackList from '../TrackList';

// probably the SUPER FILTERS in the filter panel should be created SERVER Side, and we can update it whenever user logs in first time

class Feed extends React.Component {
	renderTracksMetadata() {
		return (
			<div>
				<div>
					<SuperFilterPanel
						superFilters={[
							{
								name: 'Trending',
								filters: {
									date_range: 7,

									is_submission: false,
									page: 1,
									sort_type: 'hot',
									track_type: -1
								}
							},
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
						superFilterType="tracks"
					/>
				</div>
			</div>
		);
	}

	renderArtistsMetadata() {
		const baseFilters = {
			is_submission: false,
			page: 1,
			sort_type: 'hot',
			track_type: -1,
			date_range: -1
		};

		return (
			<div>
				<div>
					<SuperFilterPanel
						superFilters={[
							{
								name: 'Daehan',
								filters: {
									soundcloud_user_id: 4181,
									...baseFilters
								}
							},
							{
								name: 'memorecks',
								filters: {
									soundcloud_user_id: 7471,
									...baseFilters
								}
							},
							{
								name: 'VHOOR',
								filters: {
									soundcloud_user_id: 4175,
									...baseFilters
								}
							},
							{
								name: 'Hooded Youth',
								filters: {
									soundcloud_user_id: 9536,
									...baseFilters
								}
							},
							{
								name: 'whereisalex',
								filters: {
									soundcloud_user_id: 624,
									...baseFilters
								}
							}

						]}
						setFilters={this.props.setFilters}
						superFilterType="artists"
					/>
				</div>
			</div>
		);
	}
	renderLocationsMetadata() {
		const baseFilters = {
			is_submission: false,
			page: 1,
			sort_type: 'latest',
			track_type: -1,
			date_range: 14
		};

		return (
			<div>
				<div>
					<SuperFilterPanel
						superFilters={[
							{
								name: 'Brazil',
								filters: {
									location_id: 4348,
									...baseFilters
								}
							},
							{
								name: 'Sweden',
								filters: {
									location_id: 4656,
									...baseFilters
								}
							},
							{
								name: 'Seattle',
								filters: {
									location_id: 4362,
									...baseFilters
								}
							},
							{
								name: 'London',
								filters: {
									location_id: 4343,
									...baseFilters
								}
							},
							{
								name: 'Tokyo',
								filters: {
									location_id: 4404,
									...baseFilters
								}
							}
						]}
						setFilters={this.props.setFilters}
						superFilterType="locations"
					/>
				</div>
			</div>
		);
	}

	renderMetadata() {
		switch (this.props.feedType) {
			case 'tracks':
				return this.renderTracksMetadata();
				break;
			case 'locations':
				return this.renderLocationsMetadata();
				break;
			case 'artists':
				return this.renderArtistsMetadata();
				break;
			default:
				return null;
		}
	}

	render() {
		return (
			<div className="Feed">
				{this.renderMetadata()}
				<TrackList {...this.props} />
			</div>
		);
	}
}

Feed.propTypes = {
	feedType: PropTypes.string.isRequired,
	setFilters: PropTypes.func.isRequired
};

export default Feed;
