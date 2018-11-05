import React from 'react';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCWeeklyItem.scss';

const BCWeeklyItem = ({
 playlist, active, setAsActiveItem, idx
}) => {
  // description actually has the playlist / soundcloud_url
  // maybe have a choice to listen to mix OR playlist?
  // maybe like a mix mode?

  const { artwork_url, name } = playlist;
  const weekNum = name.split(' ').reverse()[0];

  return (
    <div className="BCWeeklyItem" onClick={setAsActiveItem} id={idx}>
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
      {active && playlist.tracks && <BCWeeklyTracklist idx={idx} tracks={playlist.tracks} />}
    </div>
  );
};

export default BCWeeklyItem;
