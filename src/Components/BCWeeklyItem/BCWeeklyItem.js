import React from 'react';
import { Image } from 'cloudinary-react';
import Responsive from 'react-responsive';
import LazyLoad from 'react-lazyload';
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
  const width = 600;
  // const top = 150;

  return (
    <div
      className="BCWeeklyItem"
      onClick={() => {
        setAsActiveItem(week_num);
      }}
      id={idx}
    >
      <div className="BCWeeklyItem-cover">
        <LazyLoad throttle={200} height={width}>
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
        </LazyLoad>
        {active && (
          <div className="BCWeeklyItem-cover-text">
            <h4> BURN CARTEL WEEKLY </h4>
            <div className="BCWeeklyItem-line" />
            <h4> WEEK {week_num} </h4>
          </div>
        )}
      </div>
      <Responsive maxWidth={950}>
        {active && playlist.tracks && (
          <BCWeeklyTracklist
            idx={idx}
            tracks={playlist.tracks.slice(1)}
            activeTrack={activeTrack}
            playTrack={playTrack}
            playlist={playlist}
          />
        )}
      </Responsive>
    </div>
  );
};

export default BCWeeklyItem;
