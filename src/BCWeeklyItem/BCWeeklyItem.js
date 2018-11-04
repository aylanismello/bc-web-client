import React from 'react';
import './BCWeeklyItem.scss';

const BCWeeklyItem = ({ playlist, active, setAsActiveItem }) => {
  const { soundcloud_playlist_url, image_url } = playlist;
  const weekNum = soundcloud_playlist_url
    .split('/')
    .reverse()[0]
    .split('-')
    .reverse()[0];

  return (
    <div className="BCWeeklyItem" onClick={setAsActiveItem}>
      <div className="BCWeeklyItem-cover">
        <img src={image_url} className="BCWeeklyItem-cover-image" />
        {active && (
          <div className="BCWeeklyItem-cover-text">
            <h4> BURN CARTEL WEEKLY </h4>
            <div className="BCWeeklyItem-line" />
            <h4> WEEK {weekNum} </h4>
          </div>
        )}
      </div>
      {active && <div className="BCWeeklyItem-tracklist" />}
    </div>
  );
};

export default BCWeeklyItem;
