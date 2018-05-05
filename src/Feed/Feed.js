import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Grid, Card } from 'semantic-ui-react';
import SuperFilterPanel from './SuperFilterPanel';
import TrackList from '../TrackList';

// probably the SUPER FILTERS in the filter panel should be created SERVER Side,
// and we can update it whenever user logs in first time

class Feed extends React.Component {
	renderTagsMetadata() {
		const baseFilters = {
			is_submission: false,
			page: 1,
			sort_type: 'hot',
			track_type: -1,
			date_range: 120
		};

		return (
			<div>
				<div>
					<SuperFilterPanel
						superFilters={[
							{
								name: 'Hip Hop',
								filters: {
									track_tag_id: 2,
									...baseFilters
								}
							},
							{
								name: 'Electronic',
								filters: {
									track_tag_id: 18,
									...baseFilters
								}
							},
							{
								name: 'R&B',
								filters: {
									track_tag_id: 72,
									...baseFilters
								}
							},
							{
								name: 'Future Bass',
								filters: {
									track_tag_id: 110,
									...baseFilters
								}
							},
							{
								name: 'Baile',
								filters: {
									track_tag_id: 398,
									...baseFilters
								}
							},
							{
								name: 'Jazz',
								filters: {
									track_tag_id: 252,
									...baseFilters
								}
							}
						]}
						setFilters={this.props.setFilters}
						superFilterType="tags"
					/>
				</div>
			</div>
		);
	}

	renderTracksMetadata() {
		const baseFilters = {
			is_submission: false,
			page: 1
		};

		return (
			<div>
				<div>
					<SuperFilterPanel
						superFilters={[
							{
								name: 'Trending',
								filters: {
									date_range: 7,
									sort_type: 'hot',
									track_type: -1,
									...baseFilters
								}
							},
							{
								name: 'Hot Mixes',
								filters: {
									date_range: 7,
									sort_type: 'hot',
									track_type: 2,
									...baseFilters
								}
							},
							{
								name: 'BC Picks',
								filters: {
									date_range: 365,

									sort_type: 'latest',
									track_type: -1,
									...baseFilters
								}
							},
							{
								name: 'Top Remixes',
								filters: {
									date_range: 7,
									sort_type: 'top',
									track_type: 1,
									...baseFilters
								}
							},
							{
								name: 'Latest',
								filters: {
									date_range: 7,
									sort_type: 'latest',
									track_type: -1,
									...baseFilters
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
			case 'locations':
				return this.renderLocationsMetadata();
			case 'artists':
				return this.renderArtistsMetadata();
			case 'tags':
				return this.renderTagsMetadata();
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
