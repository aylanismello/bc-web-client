import React from 'react';
import LoadingIcon from '../LoadingIcon';
import playBtn from './assets/play.svg';
import pauseBtn from './assets/pause.svg';
import './PlayButton.scss';

const PlayButton = ({ playing, togglePlay, isBannerButton }) => {
  let button;

  if (isBannerButton) {
      button = playing ? <LoadingIcon width={40} /> : <img src={playBtn} className="PlayButton-img" alt="play-btn" />;
  } else {
    button = (
        <img src={playing ? pauseBtn : playBtn} className="PlayButton-img" alt="play-btn" />
    );
  }

  return (
    <div className="PlayButton" onClick={togglePlay}>
      {button}
    </div>
  );
};

PlayButton.defaultProps = {
  isBannerButton: false
};

export default PlayButton;
