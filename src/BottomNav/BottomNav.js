import React from 'react';
import { Link } from 'react-router-dom';
import { Item, Icon } from 'semantic-ui-react';
import FiltersMenu from '../FiltersMenu';
import PlayButton from '../PlayButton';
import css from './BottomNav.css';
import NextButton from '../NextButton/NextButton';

const BottomNav = ({
	playing,
	playingTrack,
	bottomMenuVisible,
	toggleBottomMenu,
	togglePlay,
	trackFilters,
	setTrackFilters,
	setBottomMenuInvisible,
	playingTracks,
	scPlayer,
	goToNextTrackOrPaginate,
	goToPrevTrack
}) => {
	const currentTrack = playingTrack.data.track;
	return (
		<div
			className="App-bottom-nav-container"
			onClick={e => {
				if (!e.target.classList.contains('App-filters-toggle-icon')) {
					setBottomMenuInvisible();
				}
			}}
		>
			<div className="App-bottom-nav-track-info-container App-bottom-nav-box">
				{playingTrack.id ? (
					<Item>
						{/* <a */}
						{/* href={playingTrack.url} */}
						{/*  find way to return to feed with UI*/}
						<Link
							to={`/tracks/${playingTrack.data.track.id}`}
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('Click Player - Album Art', {
										trackId: playingTrack.data.track.id,
										trackName: playingTrack.data.track.name
									});
							}}
						>
							<Item.Image
								src={playingTrack.data.track.artwork_url}
								className="App-bottom-nav-track-image"
								size="tiny"
							/>
						</Link>
						{/* </a> */}
						<Item.Content
							verticalAlign="middle"
							className="App-bottom-nav-track-content"
						>
							<Item.Header className="App-bottom-nav-track-info-name">
								<Link
									to={`/tracks/${playingTrack.data.track.id}`}
									style={{ color: 'white' }}
									onClick={() => {
										window.amplitude
											.getInstance()
											.logEvent('Click Player - Track Name', {
												trackId: playingTrack.data.track.id,
												trackName: playingTrack.data.track.name
											});
									}}
								>
									{playingTrack.data.track.name}
								</Link>
							</Item.Header>
							<Item.Meta>
								<span className="App-bottom-nav-track-info-publisher">
									<Link
										to={`/soundcloud_users/${playingTrack.data.publisher[0]
											.id}`}
										style={{ color: 'gray' }}
										onClick={() => {
											window.amplitude
												.getInstance()
												.logEvent('Click Player - Artist Name', {
													trackId: playingTrack.data.track.id,
													trackName: playingTrack.data.track.name,
													artistName: playingTrack.data.publisher[0].name
												});
										}}
									>
										{playingTrack.data.publisher[0].name}
									</Link>
								</span>
							</Item.Meta>
						</Item.Content>
					</Item>
				) : null}
			</div>

			<NextButton
				iconName="fast backward"
				className="PrevButton"
				onClick={() => {
					if (scPlayer.audio.currentTime < 3 && playing) {
						goToPrevTrack(currentTrack.id);
					} else {
						scPlayer.setTime(0);
					}
				}}
			/>

			<PlayButton
				playing={playing}
				playingTrack={playingTrack}
				togglePlay={togglePlay}
			/>

			<NextButton
				iconName="fast forward"
				className="PlayButton"
				onClick={() => {
					goToNextTrackOrPaginate(currentTrack.id);
				}}
			/>

			<div className="App-bottom-nav App-bottom-nav-box">
				<FiltersMenu
					visible={bottomMenuVisible}
					trackFilters={trackFilters}
					onSortFilterChange={data =>
						setTrackFilters({
							sort_type: data.panes[data.activeIndex].value,
							page: 1
						})}
					onDateRangeFilterChange={data =>
						setTrackFilters({
							date_range: data.value,
							page: 1
						})}
					onIsBCFilterChange={data => {
						setTrackFilters({
							is_bc: data.checked
						});
					}}
					onTrackTypeFilterChange={data => {
						const { value } = data.panes[data.activeIndex];
						if (value === 'is_bc') {
							setTrackFilters({
								// reset trackType to be any, which is -1
								track_type: -1,
								page: 1,
								is_bc: true
							});
						} else {
							setTrackFilters({
								track_type: value,
								page: 1,
								is_bc: false
							});
						}
					}}
				/>
				{/* We'll bring this back when we've though it through more clearly */}
				{/* <div className="App-filters-toggle-icon-container">
         <Icon
         name="options"
         size="huge"
         color="blue"
         className="App-filters-toggle-icon"
         onClick={() => toggleBottomMenu()}
         />
         </div> */}
			</div>
		</div>
	);
};

export default BottomNav;
