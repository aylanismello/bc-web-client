import React from 'react';
import './BCWeeklyTracklist.scss';

class BCWeeklyTracklist extends React.Component {
  componentDidMount() {
    document.getElementById(this.props.idx).scrollIntoView();
  }

  render() {
    const { tracks, playTrack, playlist } = this.props;
    return (
      <div className="BCWeeklyTracklist">
        {tracks.map(track => (
          <div key={track.id} className="BCWeeklyTracklist-item" onClick={() => playTrack(track, playlist)}>
            <div className="BCWeeklyTracklist-title BCWeeklyTracklist-track-info">{track.name}</div>
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
