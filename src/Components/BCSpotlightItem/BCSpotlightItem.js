import React from 'react';
import { Image } from 'cloudinary-react';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './BCSpotlightItem.scss';

const BCSpotlightItem = ({
 width, playlist, playTrack, track, playing, trackLoading
}) => (
  <div className="BCSpotlightItem">
    <div className="BCSplotlightItem-cover">
      <Image
        className="BCSplotlightItem-cover-image"
        alt="Cover Art"
        width={width}
        crop="fit"
        quality="70"
        cloudName="burncartel"
        publicId={playlist.artwork_url}
      />
    </div>
    {playlist.tracks && (
      <BCWeeklyTracklist
        tracks={playlist.tracks.slice(1)}
        spotlight
        activeTrack={track}
        playing={playing}
        playTrack={playTrack}
        trackLoading={trackLoading}
        playlist={playlist}
      />
    )}
  </div>
);

export default BCSpotlightItem;
