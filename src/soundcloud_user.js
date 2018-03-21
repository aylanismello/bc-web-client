import React from 'react';
import axios from 'axios';
import { Segment, Tab, Container } from 'semantic-ui-react';
import TabbedSegment from './tabbed_segment';
import { baseUrl } from './config';
import './soundcloud_user.css';

class SoundcloudUser extends React.Component {

	componentWillMount() {
		this.props.setUser(this.props.match.params.id);
		this.props.fetchSoundcloudUser(this.props.match.params.id);
	}

	render() {
		return (
			<Container>
				<Segment>
					<h1>
						{this.props.soundcloudUser.name}
					</h1>
					<h2> Some stats here </h2>
				</Segment>
				<Tab
					menu={{ secondary: true, pointing: true }}
					panes={[
						{
							menuItem: 'Tracks ⬆️',
							render: () => (
								<TabbedSegment
									loading={this.props.loading}
								>
									{this.props.feed}
								</TabbedSegment>
							)
						}
					]}
				/>
			</Container>
		);
	}

}

export default SoundcloudUser;
