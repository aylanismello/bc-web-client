import React from 'react';
import { Image } from 'cloudinary-react';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCWeeklyItem.scss';

const BCWeeklyItem = ({
  playlist,
  active,
  setAsActiveItem,
  idx,
  playTrack,
  activeTrack
}) => {
  const { artwork_url, week_num } = playlist;
  const style = active ? { opacity: 0.1 } : {};
  // probs set this dynamically, responsively
  // all stryle here are computed based on React media queries,
  // so let's reflect that.
  const width = 400;
  const top = 150;
  
  return (
    <div
      className="BCWeeklyItem"
      onClick={() => setAsActiveItem(week_num)}
      id={idx}
    >
      <div className="BCWeeklyItem-cover" style={{ width: `${width}px`, height: `${width}px`}}>
        <Image
          className="BCWeeklyItem-cover-image"
          alt="Cover Art"
          width={width}
          crop="fit"
          quality="70"
          cloudName="burncartel"
          publicId={artwork_url}
          style={style}
        />
        {active && (
          <div className="BCWeeklyItem-cover-text" style={{ top: `${top}px` }}>
            <h4> BURN CARTEL WEEKLY </h4>
            <div className="BCWeeklyItem-line" />
            <h4> WEEK {week_num} </h4>
          </div>
        )}
      </div>
      {active && playlist.tracks && (
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
