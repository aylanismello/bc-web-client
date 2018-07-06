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
	Breadcrumb,
	Grid
} from 'semantic-ui-react';
import {
	publisherLocationsToString,
	makeTrackTypeBadge,
	makeBCBadge
} from '../helpers';
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
			selectedSuperFilter,
			children,
			headerText,
			displayPage,
			feedType,
			trackFilters
		} = this.props;

		// return (

	/*==========5/6===================== 3 COLMUMN GRID HTML ===================================*/
			/* 5/6 <Grid columns={3} className="TrackList-container">	    */

		/*======5/6======BELOW ALL THE WAY DOWN TO DIVIDER ALREADY COMMENTED OUT BEFORE CHANGES============*/

				{/* <Header as="h1" textAlign="left"> */}
				/*{*//* <div className="TrackList-home-header">
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
				</div> *//*}*/


				// ====5/6 THIS IS NEEDED UNCOMMENT LATER --> {children}
			  /*<Divider />*/ 

		/*======5/6========ABOVE ALL THE WAY UP TO HEADER ALREADY COMMENTED OUT BEFORE CHANGES=================*/


/* 5/6				<Grid.Row>

					{tracks.map(currentTrack => {
						const { track, publisher, curators } = currentTrack;

						return (
							<Grid.Column>
								<Item.Group relaxed divided>
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
											<Item.Header as="a" onClick={() => window.open(track.permalink_url, '_blank')}>
												{track.name}{' '}
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
5/6 */

		/*======5/6========BELOW ALREADY COMMENTED OUT BEFORE CHANGES=================*/

											/*{*//* <Item.Header>
												<Popup
													trigger={
														<Statistic className="TrackList-selection-count" size="tiny">
															<Statistic.Value>
																<Icon name="soundcloud" size="tiny" />
																{feedType === 'selection' ? curators.length : track.submission_count}
															</Statistic.Value>
															<Statistic.Label>
																{feedType === 'selection' ? 'Curators' : 'Submissions'}
															</Statistic.Label>
														</Statistic>
													}
													position="top center"
												>
													{curators.map(curator => curator.name).join(', ')}{' '}
												</Popup>

											</Item.Header> *//*}*/

	/*=======5/6=======ABOVE ALREADY COMMENTED OUT BEFORE CHANGES=================*/


/*	5/6										<Item.Description>Released {track.created_at_external}</Item.Description>
											<Item.Extra>
												{makeBCBadge(track)}
												{makeTrackTypeBadge(track)}
												{publisherLocationsToString(publisher[0]) ? (
													<Label icon="globe" content={publisherLocationsToString(publisher[0])} />
												) : null}
											</Item.Extra>
										</Item.Content>
									</Item>
								</Item.Group>
							</Grid.Column>
						);
					})}

						</Grid.Row>


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
			</Grid>
5/6 */


/*===============================3 COLMUMN GRID HTML - END ===================================*/
/*===============================1 ROW LIST HTML ===================================*/

	return (
	<Grid className="TrackList-container">

		{/*======5/6======BELOW ALL THE WAY DOWN TO DIVIDER ALREADY COMMENTED OUT BEFORE CHANGES============*/}

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

				<Item.Group relaxed divided>
					{tracks.map((currentTrack, idx) => {
						const { track, publisher, curators } = currentTrack;
						const trackImageProps = {
							fluid: true,
							src: track.artwork_url || publisher[0].avatar_url
						};

						if (
							selectedSuperFilter &&
							selectedSuperFilter.name === 'Trending'
						) {
							trackImageProps.label = {
								content: `#${idx + 1}`,
								color: 'pink',
								ribbon: 'true'
							};
						}

						return (
		<Grid.Row>
			<Item.Group relaxed divided> 
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
							onClick={() => togglePlay(track.id)}
						/>
					</div>

					<Item.Content>
						<Item.Header>
							<Link to={`/tracks/${track.id}`}>{track.name}</Link>
						</Item.Header>
						<Item.Meta className="TrackList-artist-info">
							<Link to={`/soundcloud_users/${publisher[0].id}`}>
								<div className="TrackList-artist-name">
									{publisher[0].name}
								</div>{' '}
							</Link>
							<div className="TrackList-artist-image-container">
								<Link to={`/soundcloud_users/${publisher[0].id}`}>
									<img
										className="TrackList-artist-image"
										src={publisher[0].avatar_url}
										style={
											publisher[0].is_curator
												? { border: '#df5353 solid 5px' }
												: {}
										}
									/>
								</Link>
							</div>
						</Item.Meta>

						<Item.Header>
							<Popup
								trigger={
									<Statistic
										className="TrackList-selection-count"
										size="tiny"
									>
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
										>
											<Label
												as="a"
												basic
												className="TrackList-curator-list-items"
											>
												<Image
													avatar
													spaced="right"
													src={curator.avatar_url}
												/>
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
							{publisherLocationsToString(publisher[0]) ? (
								<Label
									icon="globe"
									content={publisherLocationsToString(publisher[0])}
								/>
							) : null}
						</Item.Extra>
					</Item.Content>
				</Item>
			</Item.Group>
			<hr className="separator" />
		</Grid.Row>
			);
		})}



	{tracks && tracks.length === 1 ? null : (
		<div className="TrackList-Bottom-Buttons-Container">
			<PaginateButton
				loading={loading}
				disabled={donePaginating}
				className="PaginateButton"
				paginate={paginate}
			/>
			<Icon
				name="arrow alternate circle up outline"
				className="TrackList-Scroll-Button"
				size="big	"
				onClick={() => window.scrollTo(0, 0)}
			/>
		</div>
	)}
</div>
	
		);
	}
}

TrackList.defaultProps = {
	feedType: 'selection'
};

export default TrackList;
