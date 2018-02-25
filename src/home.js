import { Container, Tab } from 'semantic-ui-react';
import React from 'react';
import BCMap from './bc_map';
import UsersFeed from './users_feed';
import TabbedSegment from './tabbed_segment';

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
					panes={[
						{
							menuItem: 'Tracks ⬆️',
							render: () => (
								<TabbedSegment loading={loading}>
									{feedInstance()}
								</TabbedSegment>
							)
						},
						{
							menuItem: 'Map 🗺',
							render: () => (
								<BCMap data={tracksWithPosition()} featureType="track" />
							)
						},
						{
							menuItem: 'Artists 💃',
							render: () => (
								<TabbedSegment loading={loading}>
									<UsersFeed
										users={tracks.map(({ publisher }) => {
											return { ...publisher[0] };
										})}
									/>
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
