import React from 'react';
import { Segment, Card, Image, Header, Divider, Dimmer, Loader } from 'semantic-ui-react';
import './BCUsers.css';

const BCUsers = ({ tracks, loading }) => {
	const publishers = tracks.map(({ publisher, track }) => {
		return { ...publisher[0], trackName: track.name };
	});

	// publishers = [...new Set(publishers.map(publisher => publisher.id))];

	return (
		<Segment className="BCUsers-container">
			{loading ? (
				<Dimmer active inverted>
					<Loader />
				</Dimmer>
			) : null}
			<Header as="h1" textAlign="left">
				BEST NEW ARTISTS
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
		</Segment>
	);
};

export default BCUsers;
