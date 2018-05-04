import React from 'react';
import { Segment, Card, Image, Header, Divider, Dimmer, Loader } from 'semantic-ui-react';
import './users_feed.css';

const UsersFeed = ({ users }) => {
	// const publishers = tracks.map(({ publisher, track }) => {
	// 	return { ...publisher[0], trackName: track.name };
	// });

	return (
		<div className="UsersFeed-container">
			<Header as="h1" textAlign="left">
				CURATED ARTISTS
			</Header>

			<Divider />
			<Card.Group itemsPerRow={5} doubling={true}>
				{users.map(user => {
					return (
						<Card href={user.permalink_url}>
							<Image src={user.avatar_url} size="medium" />
							<Card.Header>{user.name}</Card.Header>
							{/* <Card.Meta>X Tracks about stuff</Card.Meta> */}
							<Card.Description>
								from {user.country}
							</Card.Description>
							<Card.Content extra>Dropped the track: {user.trackName}</Card.Content>
						</Card>
					);
				})}
			</Card.Group>
		</div>
	);
};

export default UsersFeed;
