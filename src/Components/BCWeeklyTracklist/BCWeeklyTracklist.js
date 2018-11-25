import React from 'react';
import EQIcon from '../EQIcon';
import './BCWeeklyTracklist.scss';

class BCWeeklyTracklist extends React.Component {
  componentDidMount() {
    // document.getElementById(this.props.idx).scrollIntoView({ behavior: 'smooth' });
    // document.getElementById(this.props.idx).scrollIntoView();
  }

  getStyle(track) {
    return this.isActive(track)
      ? {
          color: '#e54ea3'
        }
      : {};
  }

  isActive(track) {
    return track.id === this.props.activeTrack.id;
  }

  render() {
    const {
 tracks, playTrack, playlist, playing, trackLoading 
} = this.props;
    return (
      <div className="BCWeeklyTracklist">
        {tracks.map(track => (
          <div
            key={track.id}
            style={this.getStyle(track)}
            className="BCWeeklyTracklist-item"
            onClick={() => playTrack(track, playlist)}
          >
            <div className="BCWeeklyTracklist-playing-eq">
              {!trackLoading && playing && this.isActive(track) && <EQIcon width={24} />}
            </div>
            <div className="BCWeeklyTracklist-title BCWeeklyTracklist-track-info">
              {track.name}
            </div>
            <div className="BCWeeklyTracklist-artist BCWeeklyTracklist-track-info">
              {track.artist_name}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default BCWeeklyTracklist;
