import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './PlayButton.scss';

// consider renaming props since this now does more shitz
const PlayButton = ({
  playing,
  playingTrack,
  togglePlay,
  size,
  disabled,
  isGlobal,
  playingTrackId
}) => {
  let iconType, color;

  let className = 'PlayButton';
  if (isGlobal) {
    iconType = playing ? 'pause circle' : 'video play';
    color = 'pink';
  } else {
    // in this case we have an overlay
    className = `${className} PlayButton-overlay`;
    iconType = `${playing && playingTrack.id === playingTrackId ? 'pause circle' : 'play circle'}`;
    color = 'gray';
  }

  return (
    <div className={className}>
      <Icon
        name={iconType}
        inverted={!isGlobal}
        size={size}
        color={color}
        className="App-filters-toggle-icon"
        onClick={() => {
          const isHome = size === 'massive';

          if (!disabled) {
            if (isHome) {
              window.amplitude.getInstance().logEvent('Home - Click on Giant Play', {
                clickedWhileLoading: false
              });
            } else {
              window.amplitude.getInstance().logEvent('Track Player - Click on Play', {
                playing: !playing
              });
            }
            const { id } = playingTrack;
            togglePlay(id);
          } else if (isHome) {
              window.amplitude.getInstance().logEvent('Home - Click on Giant Play', {
                clickedWhileLoading: true
              });
            } else {
              window.amplitude.getInstance().logEvent('Track Player - Click on Play', { playing });
            }
        }}
      />
    </div>
  );
};

const {
 bool, objectOf, string, func
} = PropTypes;

PlayButton.propTypes = {
  playing: bool.isRequired,
  playingTrack: objectOf(string).isRequired,
  togglePlay: func.isRequired,
  size: string,
  disabled: bool,
  isGlobal: bool
};

PlayButton.defaultProps = {
  size: 'huge',
  disabled: false,
  isGlobal: true
};

export default PlayButton;
