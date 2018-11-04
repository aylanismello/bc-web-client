import React from 'react';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCWeeklyItem.scss';


const BCWeeklyItem = ({ playlist, active, setAsActiveItem }) => {
  // description actually has the playlist / soundcloud_url
  const { description, artwork_url, name } = playlist;
  const weekNum = name.split(' ').reverse()[0];

  return (
    <div className="BCWeeklyItem" onClick={setAsActiveItem}>
      <div className="BCWeeklyItem-cover">
        <img src={artwork_url} alt="Cover Art" className="BCWeeklyItem-cover-image" />
        {active && (
          <div className="BCWeeklyItem-cover-text">
            <h4> BURN CARTEL WEEKLY </h4>
            <div className="BCWeeklyItem-line" />
            <h4> WEEK {weekNum} </h4>
          </div>
        )}
      </div>
      {active && playlist.tracks && <BCWeeklyTracklist tracks={playlist.tracks} />}
    </div>
  );
};

export default BCWeeklyItem;
