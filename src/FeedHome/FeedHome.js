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
							render: () => feedInstance('home', 'custom')
						},
						{
							menuItem: 'Locations 🗺',
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
							menuItem: 'Artists 💃',
							render: () => feedInstance('home', 'artist')
						},
						{
							menuItem: 'Tags #️⃣',
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
