import React from 'react';
import './PlayerControls.scss';
import playButton from './play_button.png';
import nextButton from './next_button.png';

const PlayerControls = () => (
  <div className="PlayerControls">
    <div className="PlayerControls-btn-container">
      <img src={nextButton} className="PlayerControls-btn PlayerControls-prev-btn" />
    </div>
    <div className="PlayerControls-btn-container">
      <img src={playButton} className="PlayerControls-btn PlayerControls-play-btn" />
    </div>
    <div className="PlayerControls-btn-container">
      <img src={nextButton} className="PlayerControls-btn PlayerControls-next-btn" />
    </div>
  </div>
);

export default PlayerControls;
