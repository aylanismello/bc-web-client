import React from 'react';
import BCWeeklyTrack from './BCWeeklyTrack';
import './BCWeeklyTracklist.scss';

class BCWeeklyTracklist extends React.Component {
  state = {
    openTrackId: null,
    open: false
  };

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
      hasMix,
      setEpisodeTrack
    } = this.props;

    let finalTracks;
    // const tracklists = tracks;
    if (hasMix) finalTracks = tracks.slice(1, tracks.length);
    
    return (
      <div className={`BCWeeklyTracklist ${spotlight && 'spotlight'}`}>
        {finalTracks.map(track => (
          <BCWeeklyTrack
            setEpisodeTrack={setEpisodeTrack}
            active={this.isActive(track)}
            key={track.id}
            trackLoading={trackLoading}
            playing={playing}
            open={track.id === this.state.openTrackId && this.state.open}
            toggleOpen={trackId => {
              if (trackId === this.state.openTrackId) {
                this.setState({ open: !this.state.open });
              } else {
                this.setState({ open: true, openTrackId: trackId });
              }
            }}
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
