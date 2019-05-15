import React from 'react';
import BCWeeklyTrack from './BCWeeklyTrack';
import './BCWeeklyTracklist.scss';

class BCWeeklyTracklist extends React.Component {
  isActive(track) {
    return track.id === this.props.activeTrack.id;
  }

  showDivider(track) {
    return (
      this.props.hasMix &&
      (track.track_number === 0 || track.track_number === 1)
    );
  }

  render() {
    const {
      tracks,
      playTrack,
      collection,
      playing,
      trackLoading,
      spotlight,
      hasMix
    } = this.props;

    return (

      <div className={`BCWeeklyTracklist ${spotlight && 'spotlight'}`}>
        {tracks.map(track => (
          <BCWeeklyTrack
            active={this.isActive(track)}
            trackLoading={trackLoading}
            playing={playing}
            track={track}
            playTrack={() => playTrack(track, collection)}
            showDivider={this.showDivider(track)}
            hasMix={hasMix}
          />
        ))}
      </div>
    );
  }
}

export default BCWeeklyTracklist;
