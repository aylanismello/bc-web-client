import React from 'react';
import { Image } from 'cloudinary-react';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCSpotlightItem.scss';

const BCSpotlightItem = ({
 width, collection, playTrack, track, playing, trackLoading
}) => (
  <div className="BCSpotlightItem">
    <div className="BCSplotlightItem-cover">
    {collection && 
      <Image
        className="BCSplotlightItem-cover-image"
        alt="Cover Art"
        width={width}
        crop="fit"
        quality="70"
        cloudName="burncartel"
        publicId={collection.artwork_url}
      />
    }
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

export default BCSpotlightItem;
