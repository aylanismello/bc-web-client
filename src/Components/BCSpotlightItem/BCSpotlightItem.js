import React from 'react';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import BCProgressiveImage from '../BCProgressiveImage';
import './BCSpotlightItem.scss';

  /* <Image
className="BCSplotlightItem-cover-image"
alt="Cover Art"
width={width}
crop="fit"
quality="70"
cloudName="burncartel"
publicId={collection.artwork_url}
/> */

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
