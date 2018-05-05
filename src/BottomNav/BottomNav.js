import React from 'react';
import { Link } from 'react-router-dom';
import { Item, Icon } from 'semantic-ui-react';
import FiltersMenu from '../FiltersMenu';
import css from './BottomNav.css';

const BottomNav = ({
	playing,
	playingTrack,
	bottomMenuVisible,
	toggleBottomMenu,
	togglePlay,
	trackFilters,
	setTrackFilters,
	setBottomMenuInvisible
}) => (
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
					<a href={playingTrack.data.track.permalink_url} target="_blank">
						<Item.Image
							src={playingTrack.data.track.artwork_url}
							className="App-bottom-nav-track-image"
							size="tiny"
						/>
					</a>
					<Item.Content
						verticalAlign="middle"
						className="App-bottom-nav-track-content"
					>
						<Item.Header className="App-bottom-nav-track-info-name">
							{playingTrack.data.track.name}
						</Item.Header>
						<Item.Meta>
							<span className="App-bottom-nav-track-info-publisher">
								<Link
									to={`/soundcloud_users/${playingTrack.data.publisher[0].id}`}
								>
									{playingTrack.data.publisher[0].name}
								</Link>
							</span>
						</Item.Meta>
					</Item.Content>
				</Item>
			) : null}
		</div>

		<div className="App-bottom-nav-play-button" className="App-bottom-nav-box">
			<Icon
				name={playing ? 'pause circle' : 'video play'}
				size="huge"
				color="pink"
				className="App-filters-toggle-icon"
				onClick={() => {
					const { id } = playingTrack;
					if (id) {
						togglePlay(id);
					}
				}}
			/>
		</div>

		<div className="App-bottom-nav" className="App-bottom-nav-box">
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
			<div className="App-filters-toggle-icon-container">
				<Icon
					name="options"
					size="huge"
					color="blue"
					className="App-filters-toggle-icon"
					onClick={() => toggleBottomMenu()}
				/>
			</div>
		</div>
	</div>
);

export default BottomNav;
