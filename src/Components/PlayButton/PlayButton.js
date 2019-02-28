import React from 'react';
import LoadingIcon from '../LoadingIcon';
import ExploreButton from '../ExploreButton';
import playBtn from './assets/play.svg';
import pauseBtn from './assets/pause.svg';
import './PlayButton.scss';

const PlayButton = ({
 playing, togglePlay, loading, width, isBannerButton
}) => {
  let button;

  if (loading) {
    button = (
      <div className="PlayButton-img" width={width}>
        {' '}
        <LoadingIcon width={width} color="gray" />{' '}
      </div>
    );
  } else if (isBannerButton && !playing) {
    button = (
      <ExploreButton />
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
      style={{ width: isBannerButton ? '' : `${width}px` }}
    >
      {button}
    </div>
  );
};

PlayButton.defaultProps = {
  width: 40
};

export default PlayButton;
