import React from 'react';
import {
	Item,
	Label,
	Popup,
	Button,
	Statistic,
	Icon,
	Header,
	Divider
} from 'semantic-ui-react';
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

const Feed = ({
	tracks,
	playing,
	togglePlay,
	playingTrackId,
	loading,
	donePaginating,
	filters,
	paginate,
	children
}) => {
	return (
		<div className="Feed-container">
			<Header as="h1" textAlign="left">
				CURATED TRACKS
			</Header>

			<Divider />
			{children}

			<Item.Group relaxed divided>
				{tracks.map(currentTrack => {
					const { track, publisher, curators } = currentTrack;

					return (
						<Item key={track.id} className="Feed-track-item">
							<div
								src={track.artwork_url}
								className="Feed-artwork-play-pause-container ui small image"
							>
								<img src={track.artwork_url} />
								<Icon
									name={`${playing && track.id === playingTrackId
										? 'pause circle'
										: 'video play'} outline`}
									className="Feed-play-pause-icon"
									onClick={() => togglePlay(track.id)}
								/>
							</div>

							<Item.Content>
								<Item.Header
									as="a"
									onClick={() => window.open(track.permalink_url, '_blank')}
								>
									{track.name}{' '}
								</Item.Header>
								<Item.Meta className="Feed-artist-info">
									<div className="Feed-artist-name">{publisher[0].name}</div>
									<div className="Feed-artist-image-container">
										<a href={publisher[0].permalink_url}>
											<img
												className="Feed-artist-image"
												src={publisher[0].avatar_url}
											/>
										</a>
									</div>
								</Item.Meta>

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
			<Button
				loading={loading}
				disabled={donePaginating}
				onClick={() => {
					paginate();
				}}
			>
				{' '}
				More.{' '}
			</Button>
		</div>
	);
};

export default Feed;
