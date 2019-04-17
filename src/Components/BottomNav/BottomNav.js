import React from 'react';
import Responsive from 'react-responsive';
import { Link } from 'react-router-dom';
import './BottomNav.scss';
import blankImg from './assets/blank_img.svg';
import PlayerControls from './PlayerControls';
import SeekBar from '../SeekBar';

const BottomNav = ({
  track,
  playing,
  goToTrack,
  togglePlay,
  repeat,
  toggleRepeat,
  visualize,
  toggleVisualize,
  trackLoading,
  currentTime,
  playingCollectionNum,
  forceReopenCollectionDetail,
  defaultCollectionNum
}) => {
  let collectionLink;
  if (playingCollectionNum) {
    collectionLink = `/weekly-${playingCollectionNum}`;
  } else if (window.location.hash === '#/weekly') {
    collectionLink = `/weekly-${defaultCollectionNum}`;
  } else {
    collectionLink = `/${window.location.hash.split('?')[0]}`;
  }

  return (
    <div className="BottomNav-Container">
      <Responsive maxWidth={949}>
        <SeekBar currentTime={currentTime.raw} showTopSeekBar />
      </Responsive>
      <div className="BottomNav">
        <Link
          onClick={() => {
            if (window.location.hash.includes(playingCollectionNum)) {
              forceReopenCollectionDetail();
            }
          }}
          to={collectionLink}
        >
          <div className="BottomNav-track-info">
            <div className="BottomNav-track-info-artwork-container">
              <img
                src={
                  track.artwork_url ||
                  track.artist_artwork_url ||
                  blankImg
                }
                className="Bottom-track-info-artwork"
                alt="track-artwork"
                draggable={false}
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
        </Link>

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
    </div>
  );
};

export default BottomNav;
