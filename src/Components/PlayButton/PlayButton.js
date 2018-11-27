import React from 'react';
import LoadingIcon from '../LoadingIcon';
import playBtn from './assets/play.svg';
import pauseBtn from './assets/pause.svg';
import './PlayButton.scss';

const PlayButton = ({
 playing, togglePlay, loading
}) => {
  let button;

  if (loading) {
    button = <div className="PlayButton-img" > <LoadingIcon width={25} color="gray" /> </div>;
  } else {
    button = (
      <img
        src={playing ? pauseBtn : playBtn}
        className="PlayButton-img"
        alt="play-btn"
      />
    );
  }

  return (
    <div className="PlayButton" onClick={togglePlay}>
      {button}
    </div>
  );
};

export default PlayButton;
