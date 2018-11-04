import React from 'react';
import './BCWeeklyTracklist.scss';

const BCWeeklyTracklist = ({ tracks }) => {
  return (
    <div className="BCWeeklyTracklist">
      {tracks.map(track => (
        <div key={track.id} className="BCWeeklyTracklist-item">
          <div className="BCWeeklyTracklist-title BCWeeklyTracklist-track-info">{track.name}</div>
          <div className="BCWeeklyTracklist-artist BCWeeklyTracklist-track-info">{track.artist_name}</div>
        </div>
      ))}
    </div>
  );
};

export default BCWeeklyTracklist;
