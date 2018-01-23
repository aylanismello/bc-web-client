import React from 'react';
import { Item, Label, Popup, Header, Statistic, Icon } from 'semantic-ui-react';
import './Feed.css';

const publisherLocationsToString = publisher => {
	let locationsString = '';

	if (publisher.city) {
		locationsString += `${publisher.city}, `;
	}

	if (publisher.country) {
		locationsString += publisher.country;
	}
	return locationsString;
};

const makeTrackTypeBadge = track => {
	if (track.track_type === 1) {
		return <Label color="teal"> Remix </Label>;
	} else if (track.track_type === 2) {
		return <Label color="pink"> Mix </Label>;
	}
	return null;
};

const makeBCBadge = track => {
	if (track.episode_track_id) {
		return <Label color="black"> On BC Radio </Label>;
	}

	return null;
};

const Feed = ({ tracks }) => {
	return (
		<Item.Group divided>
			{tracks.map((currentTrack, idx) => {
				const { track, publisher, curators } = currentTrack;
				return (
					<Item key={track.id}>
						{/* <Item.Header>
							{' '}
							<Header as="h1"> {idx + 1} </Header>{' '}
						</Item.Header> */}
						<Item.Image src={track.artwork_url} size="small" />
						<Item.Content>
							<Item.Header
								as="a"
								onClick={() => window.open(track.permalink_url, '_blank')}
							>
								{track.name}{' '}
							</Item.Header>
							<Item.Meta>{publisher[0].name}</Item.Meta>

							<Item.Header>
								<Popup
									trigger={
										<Statistic className="Feed-selection-count" size="tiny">
											<Statistic.Value>
												<Icon name="soundcloud" />
												{curators.length}
											</Statistic.Value>
											<Statistic.Label>Selections</Statistic.Label>
										</Statistic>
									}
									position="top center"
								>
									{curators.map(curator => curator.name).join(', ')}{' '}
								</Popup>
							</Item.Header>
							<Item.Description>
								Released {track.created_at_external}
							</Item.Description>
							<Item.Extra>
								{makeBCBadge(track)}
								{makeTrackTypeBadge(track)}
								{publisherLocationsToString(publisher[0]) ? (
									<Label
										icon="globe"
										content={publisherLocationsToString(publisher[0])}
									/>
								) : null}
							</Item.Extra>
						</Item.Content>
					</Item>
				);
			})}
		</Item.Group>
	);
};

export default Feed;
