import React from 'react';
import { Segment, Tab, Container, Label, Icon, Divider, Image, Header } from 'semantic-ui-react';
import { publisherLocationsToString } from '../helpers';
import './soundcloud_user.css';

let lastId;

class SoundcloudUser extends React.Component {
	state = {
		lastId: null
	};

	componentWillMount() {
		this.props.setUser(this.props.match.params.id);
		this.setState({ lastId: this.props.match.params.id });
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.match.params.id != this.state.lastId) {
			this.props.setUser(this.props.match.params.id);
			this.setState({ lastId: this.props.match.params.id });
		}
	}

	render() {
		let name, is_curator, handles, avatar_url, location;
		if (this.props.soundcloudUser) {
			name = this.props.soundcloudUser.soundcloud_user.name;
			avatar_url = this.props.soundcloudUser.soundcloud_user.avatar_url;
			is_curator = this.props.soundcloudUser.soundcloud_user.is_curator;
			handles = this.props.soundcloudUser.handles;
		}

		if (this.props.tracks.length && this.props.tracks[0].publisher[0].location) {
			location = publisherLocationsToString(this.props.tracks[0].publisher[0]);
		}

		const iconNames = [
			'soundcloud',
			'twitter',
			'facebook',
			'youtube',
			'spotify',
			'instagram',
			'itunes'
		];
		return (
			<Container>
				<Segment className="Soundclouduser-Banner-Container">
					<div className="Soundclouduser-Banner-Top-Half">
						<Header as="h2">
							<Image circular src={avatar_url} /> {name}
						</Header>
						{/*  Put a map here */}
						{location && <Label icon="globe" content={location} />}
					</div>
					<Divider />
					{handles && (
						<Segment className="Soundclouduser-Banner-Handles">
							{handles.filter(handle => handle.service !== 'soundcloud').map(handle => (
								<a href={handle.url} target="_">
									<Label as="a" basic className="Soundclouduser-Banner-Handle">
										{iconNames.includes(handle.service) ? (
											<Icon name={handle.service} size="small" color="pink" />
										) : (
											<Icon name="globe" size="small" color="pink" />
										)}
										{handle.service}
									</Label>
								</a>
							))}
						</Segment>
					)}
					{is_curator && 'Is Curator'}
				</Segment>
				<Tab
					menu={{ secondary: true, pointing: true }}
					onTabChange={(e, data) => {
						if (data.activeIndex === 0) {
							this.props.setUser(this.props.match.params.id, false);
						} else {
							// is_mixes is true here
							this.props.setUser(this.props.match.params.id, true);
						}
					}}
					panes={[
						{
							menuItem: 'Tracks ⬆️',
							render: () => this.props.feed
						},
						{
							menuItem: 'Mixes 📡',
							render: () => this.props.feed
						}
					]}
				/>
			</Container>
		);
	}
}

export default SoundcloudUser;
