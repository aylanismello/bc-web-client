import React from 'react';
import './BottomNav.scss';
import PlayerControls from './PlayerControls';

const BottomNav = ({
 track, playing, goToTrack, togglePlay, repeat, toggleRepeat, visualize, toggleVisualize, trackLoading, currentTime
}) => (
  <div className="BottomNav">
    {track.id && (
      <div className="BottomNav-track-info">
        <div className="BottomNav-track-info-artwork-container">
          <img
            src={track.artwork_url}
            className="Bottom-track-info-artwork"
            alt="track-artwork"
          />
        </div>
        <div className="BottomNav-track-info-details-container">
          <span className="BottomNav-track-info-detail BottomNav-track-info-name">
            {track.name}
          </span>
          <span className="BottomNav-track-info-detail BottomNav-track-info-artist">
            {track.artist_name}
          </span>
        </div>
      </div>
    )}
    <PlayerControls
      playing={playing}
      trackLoading={trackLoading}
      goToTrack={goToTrack}
      togglePlay={togglePlay}
      repeat={repeat}
      currentTime={currentTime}
      visualize={visualize}
      toggleRepeat={toggleRepeat}
      toggleVisualize={toggleVisualize}
    />
  </div>
);

export default BottomNav;
