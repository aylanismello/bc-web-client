import React from 'react';
import {
	Item,
	Label,
	Popup,
	Button,
	Statistic,
	Icon,
	Header,
	Image,
	Divider,
	Breadcrumb
} from 'semantic-ui-react';
import { publisherLocationsToString, makeTrackTypeBadge, makeBCBadge } from '../helpers';
import PaginateButton from '../PaginateButton';
import { Link } from 'react-router-dom';
import './TrackList.css';

class TrackList extends React.Component {
	render() {
		const {
			tracks,
			playing,
			togglePlay,
			playingTrackId,
			loading,
			donePaginating,
			filters,
			paginate,
			children,
			headerText,
			displayPage,
			feedType,
			trackFilters
		} = this.props;

		return (
			<div className="TrackList-container">
				{/* <Header as="h1" textAlign="left"> */}
				{/* <div className="TrackList-home-header">
					{displayPage === 'home' ? (
						<Breadcrumb size="huge">
							<Breadcrumb.Section
								active={!this.props.trackFilters.is_submission}
								onClick={() => this.props.setIsSubmission(false)}
							>
								{' '}
								Curated Tracks{' '}
							</Breadcrumb.Section>
							<Breadcrumb.Divider />
							<Breadcrumb.Section
								active={this.props.trackFilters.is_submission}
								onClick={() => this.props.setIsSubmission(true)}
							>
								{' '}
								Submitted Tracks{' '}
							</Breadcrumb.Section>
						</Breadcrumb>
					) : (
						null
					)}
				</div> */}

				{/* {children} */}
				<Divider />

				<Item.Group relaxed divided>
					{tracks.map(currentTrack => {
						const { track, publisher, curators } = currentTrack;

						return (
							<Item key={track.id} className="TrackList-track-item">
								<div
									src={track.artwork_url}
									className="TrackList-artwork-play-pause-container ui small image"
								>
									<img src={track.artwork_url || publisher[0].avatar_url} />
									<Icon
										name={`${playing && track.id === playingTrackId
											? 'pause circle'
											: 'video play'} outline`}
										className="TrackList-play-pause-icon"
										onClick={() => togglePlay(track.id)}
									/>
								</div>

								<Item.Content>
									<Item.Header>
										<Link to={`/tracks/${track.id}`}>{track.name}</Link>
									</Item.Header>
									<Item.Meta className="TrackList-artist-info">
										<Link to={`/soundcloud_users/${publisher[0].id}`}>
											<div className="TrackList-artist-name">{publisher[0].name}</div>{' '}
										</Link>
										<div className="TrackList-artist-image-container">
											<a href={publisher[0].permalink_url} target="_">
												<img
													className="TrackList-artist-image"
													src={publisher[0].avatar_url}
													style={publisher[0].is_curator ? { border: '#df5353 solid 5px' } : {}}
												/>
											</a>
										</div>
									</Item.Meta>

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
										>
											<Item.Group>
												{curators.map(curator => (
													<Link
														key={curator.name}
														className="TrackList-curator-popup-container"
														to={`/soundcloud_users/${curator.id}`}
													>
														<Label as="a" basic>
															<Image avatar spaced="right" src={curator.avatar_url} />
															{curator.name}
														</Label>
													</Link>
												))}
											</Item.Group>
										</Popup>
									</Item.Header>
									<Item.Description>Released {track.created_at_external}</Item.Description>
									<Item.Extra>
										{makeBCBadge(track)}
										{makeTrackTypeBadge(track)}
										{publisherLocationsToString(publisher[0]) ? (
											<Label icon="globe" content={publisherLocationsToString(publisher[0])} />
										) : null}
									</Item.Extra>
								</Item.Content>
							</Item>
						);
					})}
				</Item.Group>

				<PaginateButton loading={loading} disabled={donePaginating} paginate={paginate} />
			</div>
		);
	}
}

TrackList.defaultProps = {
	feedType: 'selection'
};

export default TrackList;
