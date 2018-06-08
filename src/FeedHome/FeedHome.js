import { Container, Tab } from 'semantic-ui-react';
import React from 'react';
import TabbedSegment from '../TabbedSegment';

class FeedHome extends React.Component {

	componentWillMount() {
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
			<Container>
				<Tab
					menu={{ secondary: true, pointing: true }}
					panes={[
						{
							menuItem: 'Tracks ⬆️',
							render: () => (
								<TabbedSegment loading={loading}>
									{feedInstance('home', 'custom')}
								</TabbedSegment>
							)
						},
						{
							menuItem: 'Locations 🗺',
							render: () => (
								<div>
									<TabbedSegment loading={loading}>
										{feedInstance('home', 'location')}
									</TabbedSegment>
									{/* <BCMap
										data={tracksWithPosition()}
										featureType="track"
										loading={this.props.loading}
									/> */}
								</div>
							)
						},
						{
							menuItem: 'Artists 💃',
							render: () => (
								<TabbedSegment loading={loading}>
									{feedInstance('home', 'artist')}
									{/* <UsersFeed
										users={tracks.map(({ publisher }) => {
											return { ...publisher[0] };
										})}
									/> */}
								</TabbedSegment>
							)
						},
						{
							menuItem: 'Tags #️⃣',
							render: () => (
								<TabbedSegment loading={loading}>
									{feedInstance('home', 'tag')}
								</TabbedSegment>
							)
						}
					]}
				/>
			</Container>
		);
	}
}

export default FeedHome;
