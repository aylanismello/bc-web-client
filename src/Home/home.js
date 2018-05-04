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
							render: () => <TabbedSegment loading={loading}>{feedInstance()}</TabbedSegment>
						},
						{
							menuItem: 'Map 🗺',
							render: () => (
								<BCMap
									data={tracksWithPosition()}
									featureType="track"
									loading={this.props.loading}
								/>
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
