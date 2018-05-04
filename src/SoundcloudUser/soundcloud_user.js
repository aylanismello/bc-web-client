import React from 'react';
import axios from 'axios';
import { Segment, Tab, Container } from 'semantic-ui-react';
import TabbedSegment from '../TabbedSegment';
import { baseUrl } from '../config';
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
					<h1>{this.props.soundcloudUser.name}</h1>
					<h2> Some stats here </h2>
				</Segment>
				<Tab
					menu={{ secondary: true, pointing: true }}
					onTabChange={(e, data) => {
						if(data.activeIndex === 0) {
							this.props.setUser(this.props.match.params.id, false);
						} else {
							// is_mixes is true here
							this.props.setUser(this.props.match.params.id, true);
						}
					}}
					panes={[
						{
							menuItem: 'Tracks ⬆️',
							render: () => (
								<TabbedSegment loading={this.props.loading}>{this.props.feed}</TabbedSegment>
							)
						},
						{
							menuItem: 'Mixes 📡',
							render: () => (
								<TabbedSegment loading={this.props.loading}>{this.props.feed}</TabbedSegment>
							)
						}
					]}
				/>
			</Container>
		);
	}
}

export default SoundcloudUser;
