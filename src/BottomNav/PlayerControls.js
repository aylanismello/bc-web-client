import React from 'react';
import './PlayerControls.scss';
import playButton from './assets/play.svg';
import nextButton from './assets/next.svg';
import prevButton from './assets/prev.svg';

const PlayerControls = ({ playing, togglePlay, goToTrack }) => (
  <div className="PlayerControls">
    <div className="PlayerControls-btn-container prev" onClick={() => goToTrack('prev')}>
      <img
        src={prevButton}
        className="PlayerControls-btn PlayerControls-prev-btn"
      />
    </div>
    <div className="PlayerControls-btn-container play" onClick={togglePlay}>
      <img
        src={playButton}
        className="PlayerControls-btn PlayerControls-play-btn"
        style={playing ? { background: 'white', borderRadius: '100px' } : {}}
      />
    </div>
    <div className="PlayerControls-btn-container next" onClick={() => goToTrack('next')} >
      <img
        src={nextButton}
        className="PlayerControls-btn PlayerControls-next-btn"
      />
    </div>
  </div>
);

export default PlayerControls;
