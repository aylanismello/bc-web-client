import React from 'react';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCWeeklyItem.scss';

const BCWeeklyItem = ({
 playlist, active, setAsActiveItem, idx, playTrack, activeTrack
}) => {
  // maybe have a choice to listen to mix OR playlist?
  // maybe like a mix mode?
  const { artwork_url, week_num } = playlist;
  const style = active ? { opacity: 0.1 } : {};
  return (
    <div className="BCWeeklyItem" onClick={() => setAsActiveItem(week_num)} id={idx}>
      <div className="BCWeeklyItem-cover">
        <img src={artwork_url} alt="Cover Art" className="BCWeeklyItem-cover-image" style={style} />
        {active && (
          <div className="BCWeeklyItem-cover-text">
            <h4> BURN CARTEL WEEKLY </h4>
            <div className="BCWeeklyItem-line" />
            <h4> WEEK {week_num} </h4>
          </div>
        )}
      </div>
      {active &&
        playlist.tracks && (
          <BCWeeklyTracklist
            idx={idx}
            tracks={playlist.tracks}
            activeTrack={activeTrack}
            playTrack={playTrack}
            playlist={playlist}
          />
        )}
    </div>
  );
};

export default BCWeeklyItem;
