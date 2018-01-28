import React from 'react';
import { Segment, Card, Image, Header, Divider, Dimmer, Loader } from 'semantic-ui-react';
import './BCUsers.css';

const BCUsers = ({ tracks }) => {
	const publishers = tracks.map(({ publisher, track }) => {
		return { ...publisher[0], trackName: track.name };
	});

	return (
		<div className="BCUsers-container">
			<Header as="h1" textAlign="left">
				BEST ARTISTS
			</Header>

			<Divider />
			<Card.Group>
				{publishers.map(publisher => {
					return (
						<Card href={publisher.permalink_url}>
							<Image src={publisher.avatar_url} size="medium" />
							<Card.Header>{publisher.name}</Card.Header>
							<Card.Meta>X Tracks about stuff</Card.Meta>
							<Card.Description>
								{publisher.name} is dope and lives in {publisher.country}
							</Card.Description>
							<Card.Content extra>Dropped the track: {publisher.trackName}</Card.Content>
						</Card>
					);
				})}
			</Card.Group>
		</div>
	);
};

export default BCUsers;
