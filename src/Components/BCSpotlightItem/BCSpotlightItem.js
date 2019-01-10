import React from 'react';
import BCProgressiveImage from '../BCProgressiveImage';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCSpotlightItem.scss';

const BCSpotlightItem = ({
  width,
  collection,
  playTrack,
  track,
  playing,
  trackLoading
}) => {
  return (
    <div className="BCSpotlightItem">
      <div className="BCSplotlightItem-cover">
        {collection && (
          <BCProgressiveImage max_width={width} artwork_url={collection.artwork_url} />
        )}
      </div>
      {collection && collection.tracks && (
        <BCWeeklyTracklist
          tracks={collection.tracks.slice(1)}
          spotlight
          activeTrack={track}
          playing={playing}
          playTrack={playTrack}
          trackLoading={trackLoading}
          collection={collection}
        />
      )}
    </div>
  );
};

export default BCSpotlightItem;
