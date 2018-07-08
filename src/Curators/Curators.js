import React from 'react';
import {
	Dimmer,
	Segment,
	Loader,
	Divider,
	Header,
	Card,
	Container,
	Image,
	Item,
	Tab,
	Label
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
	publisherLocationsToString
} from '../helpers';
import PaginateButton from '../PaginateButton';
import CuratorList from '../CuratorList';
import BCMap from '../BCMap';
import './Curators.css';

class Curators extends React.Component {
	componentWillMount() {
		if (!this.props.curators.length) {
			this.props.fetchCurators();
		}
	}

	renderList(curators) {
		return (
			<Item.Group relaxed divided>
				{curators.map((curator, idx) => {
					return (
						<Item key={curator.id}>
							<div className="Curators-curator-list-item">
								<Link to={`/soundcloud_users/${curator.soundcloud_user.id}`}>
									{/* <Label color="teal">#{idx + 1}</Label> */}
									<Label as="a" basic>
										<Image
											avatar
											spaced="right"
											src={curator.soundcloud_user.avatar_url}
											style={{ border: '#df5353 solid 5px' }}
										/>
										{curator.soundcloud_user.name}
									</Label>
								</Link>
								<Label
									icon="globe"
									content={publisherLocationsToString({
										location: curator.location.name
									})}
								/>
							</div>
						</Item>
					);
				})}
			</Item.Group>
		);
	}

	renderGallery(curators) {
		return (
			<Card.Group>
				{curators.map(curator => {
					return (
						<Link to={`/soundcloud_users/${curator.soundcloud_user.id}`}>
							<Card.Content>
								<Image src={curator.soundcloud_user.avatar_url} size="tiny" />
							</Card.Content>
						</Link>
					);
				})}
			</Card.Group>
		);
	}
	render() {
		const view = {
			list: 0,
			map: 1
		};

		return (
			<Container>
				<Tab
					menu={{ secondary: true, pointing: true }}
					activeIndex={parseInt(view[this.props.view] || 0)}
					onTabChange={(e, data) => {
						window.location = `/#curators/${Object.keys(view)[
							parseInt(data.activeIndex)
						]}`;
					}}
					panes={[
						{
							menuItem: 'List ⬆️',
							render: () => (
								<Segment>
									<Header as="h1"> Curators </Header>
									<Divider />
									<p className="About-text-intro About-text">
										{' '}
										Burn Cartel is powered by these collectives, labels, and
										radio shows. Hit us up if you want to see your curation up
										here. <Link to="/about"> More info here </Link>
									</p>
									<Divider />

									<Dimmer.Dimmable as={Segment} dimmed={this.props.loading}>
										<Dimmer active={this.props.loading} inverted>
											<Loader> Loading </Loader>
										</Dimmer>


										<CuratorList curators={this.props.curators} view="list" />
									</Dimmer.Dimmable>
									<PaginateButton
										loading={this.props.loading}
										donePaginating={false}
										paginate={() => this.props.fetchCurators(true)}
									/>
								</Segment>
							)
						},
						{
							menuItem: 'Map 🗺',
							render: () => (
								<BCMap
									featureType="soundcloudUser"
									size={100}
									data={this.props.curators}
									loading={this.props.loading}
								/>
							)
						}
					]}
				/>
			</Container>
		);
	}
}

export default Curators;
