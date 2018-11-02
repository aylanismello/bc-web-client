import React from 'react';
import { Item, Icon, Divider } from 'semantic-ui-react';
import PaginateButton from '../PaginateButton';
import TrackItem from '../TrackItem';
import './TrackList.scss';

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
			trackFilters,
			isWidget,
			hasEmptyTracks
		} = this.props;

		const daTracks = isWidget ? tracks.slice(0, 10) : tracks;

		return (
			<div className="TrackList-container">
				<Item.Group relaxed divided>
					{daTracks.map((currentTrack, idx) => {
						return (
							<TrackItem
								currentTrack={currentTrack}
								selectedSuperFilter={selectedSuperFilter}
								idx={idx}
								playingTrackId={playingTrackId}
								playing={playing}
								isWidget={isWidget}
								togglePlay={togglePlay}
							/>
						);
					})}
				</Item.Group>
				<Divider />

				{(tracks && tracks.length === 1) || isWidget ? null : (
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
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('TrackList - Click Scroll To Top Button');
								window.scrollTo(0, 0);
							}}
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
