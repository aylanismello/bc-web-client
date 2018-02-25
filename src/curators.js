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
	Tab
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import BCMap from './bc_map';
import './curators.css';

const Curators = ({ curators }) => {
	return (
		<Container>
			<Tab
				menu={{ secondary: true, pointing: true }}
				panes={[
					{
						menuItem: 'List',
						render: () => (
							<Segment>
								<Header as="h1"> Curators </Header>
								<Divider />
								<p className="About-text-intro About-text">
									{' '}
									Burn Cartel is powered by these collectives, labels, and radio
									shows. Hit us up if you want to see your curation up here.{' '}
									<Link to="/about"> More info here </Link>
								</p>
								<Divider />

								<Card.Group>
									{curators.map(curator => {
										return (
											<Link
												to={`/soundcloud_users/${curator.soundcloud_user.id}`}
											>
												<Card.Content>
													<Image
														src={curator.soundcloud_user.avatar_url}
														size="tiny"
													/>
												</Card.Content>
											</Link>
										);
									})}
								</Card.Group>
							</Segment>
						)
					},
					{
						menuItem: 'Map',
						render: () => <BCMap featureType="soundcloudUser" data={curators} />
					}
				]}
			/>
		</Container>
	);
};

export default Curators;
