import React from 'react';
import {
	Segment,
	Tab,
	Container,
	Label,
	Icon,
	Divider,
	Image,
	Header,
	Popup,
	Statistic,
	Responsive,
	List,
	Grid
} from 'semantic-ui-react';
import MediaQuery from 'react-responsive';
import { formatSoundcloudUserForMap } from '../helpers';
import BCMap from '../BCMap';
import './soundcloud_user.css';

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

	renderHandles(allHandles) {
		return (
			<Grid doubling columns={8}>
				{allHandles.map(handle => <Grid.Column>{handle}</Grid.Column>)}
			</Grid>
		);
	}

	render() {
		let name, is_curator, handles, avatar_url, location, permalink_url;
		const data = this.props.soundcloudUser
			? [formatSoundcloudUserForMap(this.props.soundcloudUser)]
			: [];
		const associated_users = this.props.soundcloudUser
			? this.props.soundcloudUser.associated_users
			: [];

		if (this.props.soundcloudUser) {
			name = this.props.soundcloudUser.soundcloud_user.name;
			avatar_url = this.props.soundcloudUser.soundcloud_user.avatar_url;
			is_curator = this.props.soundcloudUser.soundcloud_user.is_curator;
			permalink_url = this.props.soundcloudUser.soundcloud_user.permalink_url;
			handles = this.props.soundcloudUser.handles;
			location = this.props.soundcloudUser.location.name;
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

		const soundcloudHandle = [
			<a href={permalink_url} target="_">
				<Label as="a" basic className="Soundclouduser-Banner-Handle">
					<Icon name="soundcloud" size="small" color="pink" />
					soundcloud
				</Label>
			</a>
		];

		const formattedHandles =
			handles &&
			handles.filter(handle => handle.service !== 'soundcloud').map(handle => (
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
			));

		return (
			<Container>
				<Segment className="Soundclouduser-Banner-Container">
					<div className="Soundclouduser-Banner-Top-Half">
						<div>
							<Header as="h2">
								<Image
									circular
									src={avatar_url}
									style={is_curator ? { border: '#df5353 solid 5px' } : {}}
								/>{' '}
								{name}
							</Header>
						</div>
						{/*  Put a map here */}
						{location && (
							<Segment className="SoundcloudUser-Map-Container">
								<BCMap
									featureType="soundcloudUser"
									data={data}
									loading={this.props.loading}
									isSingleUser
									size="small"
								/>

								<Label icon="globe" content={location} />
							</Segment>
						)}
					</div>
					<Divider />
					{handles && (
						<div className="Soundclouduser-Banner-Handles">
							{this.renderHandles([...soundcloudHandle, ...formattedHandles])}
						</div>
					)}
					<Divider />

					<div className="SoundcloudUser-Associated-User">
						{/* <Statistic size="tiny">
							<Statistic.Value text>
								Most
								<br />Selected
							</Statistic.Value>
							<Statistic.Label>Artists</Statistic.Label>
						</Statistic> */}

						{is_curator ? (
							<Statistic size="tiny">
								<Statistic.Value text>
									Most
									<br />Selected
								</Statistic.Value>
								<Statistic.Label>Artists</Statistic.Label>
							</Statistic>
						) : (
							<Statistic size="tiny">
								<Statistic.Value text>
									Curators
									<br />Selecting
								</Statistic.Value>
								<Statistic.Label>Most</Statistic.Label>
							</Statistic>
						)}
						<List
							animated
							divided
							horizontal
							ordered
							size="small"
							className="SoundcloudUser-Associated-User-List"
						>
							{associated_users.slice(0, 6).map(user => (
								<List.Item
									as="a"
									onClick={() =>
										(window.location = `#/soundcloud_users/${user.id}`)}
								>
									<Image avatar src={user.avatar_url} />
									<MediaQuery minWidth={600}>
										<List.Content>{user.name}</List.Content>
									</MediaQuery>
								</List.Item>
							))}
						</List>
					</div>
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
