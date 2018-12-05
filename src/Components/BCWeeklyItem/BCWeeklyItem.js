import React from 'react';
import { Image } from 'cloudinary-react';
import Responsive from 'react-responsive';
import LazyLoad from 'react-lazyload';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCWeeklyItem.scss';

const Placeholder = () => (
  <div
    className="BCWeeklyItem-cover-image"
    style={{
      background: '#262632'
    }}
  />
);

const BCWeeklyItem = ({
  playlist,
  active,
  setAsActiveItem,
  idx,
  playTrack,
  activeTrack
}) => {
  const { artwork_url, week_num } = playlist;
  // const style = active ? { opacity: 0.1 } : {};
  const style1 = active ? 'opaque' : '';
  // probs set this dynamically, responsively
  // all stryle here are computed based on React media queries,
  // so let's reflect that.
  const width = 600;
  // const top = 150;

  const style2 = active ? 'visible' : 'hidden';

  return (
    <div
      className="BCWeeklyItem"
      onClick={() => {
        setAsActiveItem(week_num);
      }}
      id={idx}
    >
      <div className="BCWeeklyItem-cover">
        {/* TODO: somehow make default set to whatever */}
        <LazyLoad
          width={width}
          height={width}
          once
          placeholder={<Placeholder width={width} />}
        >
          <Image
            className={`BCWeeklyItem-cover-image ${style1}`}
            width={width}
            crop="fit"
            quality="70"
            cloudName="burncartel"
            publicId={artwork_url}
          />
        </LazyLoad>
        <div className={`BCWeeklyItem-cover-text ${style2}`}>
          <h4> BURN CARTEL WEEKLY </h4>
          <div className="BCWeeklyItem-line" />
          <h4> WEEK {week_num} </h4>
        </div>
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
