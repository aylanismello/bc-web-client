import { Container, Tab } from 'semantic-ui-react';
import React from 'react';
import BCMap from '../BCMap';
import UsersFeed from '../UsersFeed';
import TabbedSegment from '../TabbedSegment';

class Home extends React.Component {
	state = {
		trackType: 'curated'
	};

	componentWillMount() {
		this.props.getHomeTracks();
	}

	componentWillUpdate(np, nextState) {
		if (nextState.trackType !== this.state.trackType) {
			this.props.setState({
				trackFilters: {
					...this.props.trackFilters,
					is_submission: true
				}
			});
		}
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
					onTabChange={(e, data) => {
						if (data.activeIndex === 0) {
							this.props.setIsSubmission(false);
						}
					}}
					panes={[
						{
							menuItem: 'Tracks ⬆️',
							render: () => (
								<TabbedSegment loading={loading}>
									{feedInstance('home', 'tracks')}
								</TabbedSegment>
							)
						},
						{
							menuItem: 'Locations 🗺',
							render: () => (
								<div>
									<TabbedSegment loading={loading}>
										{feedInstance('home', 'locations')}
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
									{feedInstance('home', 'artists')}
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
									{feedInstance('home', 'tags')}
								</TabbedSegment>
							)
						}
					]}
				/>
			</Container>
		);
	}
}

export default Home;