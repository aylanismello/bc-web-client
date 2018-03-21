import React from 'react';
import axios from 'axios';
import { Segment, Tab, Container } from 'semantic-ui-react';
import TabbedSegment from './tabbed_segment';
import { baseUrl } from './config';

class SoundcloudUser extends React.Component {
	state = {
		soundcloudUser: {}
	};

	componentWillMount() {
		this.props.setUser(this.props.match.params.id);
		axios
			.get(`${baseUrl}/soundcloud_users/${this.props.match.params.id}`)
			.then(results => {
				this.setState({
					soundcloudUser: results.data.data.soundcloud_user
				});
			});
	}

	render() {
		return (
			<Container>
				<Segment>
					<h1>
						{this.state.soundcloudUser.name}
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
									loading={this.state.loading}
									firstRequestMade={this.state.firstRequestMade}
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
