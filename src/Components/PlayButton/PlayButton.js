import React from 'react';
import LoadingIcon from '../LoadingIcon';
import playBtn from './assets/play.svg';
import pauseBtn from './assets/pause.svg';
import './PlayButton.scss';

const PlayButton = ({
 playing, togglePlay, loading, width
}) => {
  let button;

  if (loading) {
    button = (
      <div className="PlayButton-img" width={width}>
        {' '}
        <LoadingIcon width={width} color="gray" />{' '}
      </div>
    );
  } else {
    button = (
      <img
        src={playing ? pauseBtn : playBtn}
        style={{ width: `${width}px`, height: `${width}px` }}
        className="PlayButton-img"
        alt="play-btn"
        draggable={false}
      />
    );
  }

  return (
    <div
      className="PlayButton"
      onClick={togglePlay}
      style={{ width: `${width}px` }}
    >
      {button}
    </div>
  );
};

PlayButton.defaultProps = {
  width: 40
};

export default PlayButton;
