import React from 'react';
import { Header, Item, Icon, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './Feed.css';

const LocationFeed = ({ locations, children }) => {
	return (
		<div className="Feed-container">
			<Divider />
			{children}

			<Item.Group relaxed divided>
				{locations.map(currentLocation => {
					const { location, soundcloud_users } = currentLocation;

					return (
						<Item key={location.id} className="Feed-track-item">
							<Item.Content>
								<Item.Header>{location.name} </Item.Header>
							</Item.Content>
						</Item>
					);
				})}
			</Item.Group>
		</div>
	);
};

export default LocationFeed;
