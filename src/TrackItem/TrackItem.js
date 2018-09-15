import React from 'react';
import {
	Item,
	Label,
	Popup,
	Statistic,
	Icon,
	Image
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
	publisherLocationsToString,
	makeTrackTypeBadge,
	makeBCBadge
} from '../helpers';

const TrackItem = ({
	currentTrack,
	selectedSuperFilter,
	idx,
	isWidget,
	playing,
	playingTrackId,
	togglePlay
}) => {
	const { track, publisher, curators } = currentTrack;
	const trackImageProps = {
		fluid: true,
		src: track.artwork_url || publisher[0].avatar_url
	};

	if (selectedSuperFilter && selectedSuperFilter.name === 'Trending') {
		trackImageProps.label = {
			content: `#${idx + 1}`,
			color: 'pink',
			ribbon: 'true'
		};
	}

	return (
		<Item key={track.id} className="TrackList-track-item">
			<div
				src={track.artwork_url}
				className="TrackList-artwork-play-pause-container ui small image"
			>
				<Image {...trackImageProps} />
				<Icon
					name={`${playing && track.id === playingTrackId
						? 'pause circle'
						: 'video play'} outline`}
					className="TrackList-play-pause-icon"
					onClick={() => {
						window.amplitude.getInstance().logEvent('TrackList - Toggle Play', {
							id: track.id,
							name: track.name
						});
						togglePlay(track.id);
					}}
				/>
			</div>

			<Item.Content>
				<Item.Header>
					<Link
						to={`/tracks/${track.id}`}
						onClick={() => {
							window.amplitude
								.getInstance()
								.logEvent('TrackList - Click on Track Name', {
									id: track.id,
									name: track.name
								});
						}}
					>
						{track.name}
					</Link>
				</Item.Header>
				<Item.Meta className="TrackList-artist-info">
					<Link
						to={`/soundcloud_users/${publisher[0].id}`}
						onClick={() => {
							window.amplitude
								.getInstance()
								.logEvent('TrackList - Click on Artist Name', {
									trackId: track.id,
									trackName: track.name,
									artistId: publisher[0].id,
									artistName: publisher[0].name
								});
						}}
					>
						<div className="TrackList-artist-name">
							{publisher[0].name}
						</div>{' '}
					</Link>
					<div className="TrackList-artist-image-container">
						<Link
							to={`/soundcloud_users/${publisher[0].id}`}
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('TrackList - Click on Artist Avatar', {
										trackId: track.id,
										trackName: track.name,
										artistId: publisher[0].id,
										artistName: publisher[0].name
									});
							}}
						>
							<img
								className="TrackList-artist-image"
								src={publisher[0].avatar_url}
								style={
									publisher[0].is_curator ? { border: '#df5353 solid 5px' } : {}
								}
							/>
						</Link>
					</div>
				</Item.Meta>
				{!isWidget && (
					<div>
						<Item.Header>
							<Popup
								trigger={
									<Statistic className="TrackList-selection-count" size="tiny">
										<Statistic.Value>
											<Icon name="soundcloud" size="tiny" />
											{/* {feedType === 'selection' ? curators.length : track.submission_count} */}
											{curators.length}
										</Statistic.Value>
										<Statistic.Label>
											{/* {feedType === 'selection' ? 'Curators' : 'Submissions'} */}
											Curators
										</Statistic.Label>
									</Statistic>
								}
								position="top center"
								hoverable
								basic
							>
								<Item.Group>
									{curators.slice(0, 8).map(curator => (
										<Link
											key={curator.name}
											className="TrackList-curator-popup-container"
											to={`/soundcloud_users/${curator.id}`}
											onClick={() => {
												window.amplitude
													.getInstance()
													.logEvent('TrackList - Click on Curator', {
														id: curator.id,
														name: curator.name
													});
											}}
										>
											<Label
												as="a"
												basic
												className="TrackList-curator-list-items"
											>
												<Image avatar spaced="right" src={curator.avatar_url} />
												{curator.name}
											</Label>
										</Link>
									))}
								</Item.Group>
							</Popup>
						</Item.Header>
						<Item.Description>
							Released {track.created_at_external}
						</Item.Description>
						<Item.Extra>
							{makeBCBadge(track)}
							{makeTrackTypeBadge(track)}
							{publisherLocationsToString(publisher[0].location) ? (
								<Label
									icon="globe"
									content={publisherLocationsToString(publisher[0].location)}
								/>
							) : null}
						</Item.Extra>
					</div>
				)}
			</Item.Content>
		</Item>
	);
};
export default TrackItem;
