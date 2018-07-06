import { Container, Tab } from 'semantic-ui-react';
import React from 'react';
import TabbedSegment from '../TabbedSegment';
import './FeedHome.css';

const superfilter_types = {
	custom: 0,
	location: 1,
	artist: 2,
	tag: 3
};

class FeedHome extends React.Component {
	componentWillMount() {
		this.props.getHomeTracks();
		// this.props.fetchSuperfilters('custom');
	}

	render() {
		const {
			loading,
			trackFilters,
			tracks,
			setState,
			tracksWithPosition,
			feedInstance
		} = this.props;
		return (
			<Container >
				<Tab
					menu={{ secondary: true, pointing: true }}
					activeIndex={parseInt(superfilter_types[this.props.superfilter_type] || 0)}
					onTabChange={(e, data) => {
						window.location =
							`/#feed/${Object.keys(superfilter_types)[parseInt(data.activeIndex)]}`;
					}}
					panes={[
						{
							menuItem: 'Tracks',
							render: () => feedInstance('home', 'custom')
						},
						{
							// menuItem: 'Locations 🗺',
							menuItem: 'Locations',
							render: () => (
								<div>
									{feedInstance('home', 'location')}
									{/* <BCMap
										data={tracksWithPosition()}
										featureType="track"
										loading={this.props.loading}
									/> */}
								</div>
							)
						},
						{
							menuItem: 'Artists',
							render: () => feedInstance('home', 'artist')
						},
						{
							menuItem: 'Tags',
							render: () => feedInstance('home', 'tag')
						}
					]}
				/>
			</Container>
		);
	}
}

{
	/* <UsersFeed
		users={tracks.map(({ publisher }) => {
			return { ...publisher[0] };
		})
	/>  */
}

export default FeedHome;
