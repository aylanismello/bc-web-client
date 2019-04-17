import React from 'react';
import Responsive from 'react-responsive';
import PlayButton from '../PlayButton';
import './PlayerControls.scss';
import nextBtn from './assets/next.svg';
import prevBtn from './assets/prev.svg';
import repeatBtn from './assets/repeat.svg';
import visualizerBtn from './assets/chart-bars.svg';
import SeekBar from '../SeekBar';

const getActiveStyle = active =>
  (active
    ? { filter: 'invert(.5) sepia(1) saturate(19) hue-rotate(300deg)' }
    : {});

class PlayerControls extends React.Component {
  state = {
    nowClicked: {
      next: false,
      play: false,
      prev: false
    }
  };

  setBtnClicked(btn, clicked) {
    const newNowClicked = {};
    newNowClicked[btn] = clicked;
    this.setState({
      nowClicked: { ...this.state.nowClicked, ...newNowClicked }
    });
  }

  getBtnStyle(btn) {
    // return this.state.nowClicked[btn] ? { opacity: 1.4 } : {};

    return this.state.nowClicked[btn]
      ? {
        opacity: 0.6
        }
      : {};
  }
  render() {
    const {
      playing,
      togglePlay,
      goToTrack,
      repeat,
      visualize,
      toggleRepeat,
      toggleVisualize,
      trackLoading,
      currentTime
    } = this.props;
    return (
      <div className="PlayerControls">
        {/* <Responsive minWidth={950}>
      <div
        className="PlayerControls-btn-container visualizer"
        onClick={toggleVisualize}
        style={getActiveStyle(visualize)}
      >
        <img
          src={visualizerBtn}
          className="PlayerControls-btn PlayerControls-visualizer-btn"
          alt="visualizer-btn"
        />
      </div>
    </Responsive> */}

        <div className="PlayerControls-core-controls">
          <div
            className="PlayerControls-btn-container prev"
            onClick={() => goToTrack('prev')}
            onMouseDown={() => this.setBtnClicked('prev', true)}
            onTouchStart={() => this.setBtnClicked('prev', true)}
            onMouseUp={() => this.setBtnClicked('prev', false)}
            onTouchEnd={() => this.setBtnClicked('prev', false)}
            onMouseLeave={() => this.setBtnClicked('prev', false)}
            onTouchMove={() => this.setBtnClicked('prev', false)}
            style={this.getBtnStyle('prev')}
          >
            <img
              src={prevBtn}
              className="PlayerControls-btn PlayerControls-prev-btn"
              alt="prev-btn"
              draggable={false}
            />
          </div>

          <div
            onMouseDown={() => this.setBtnClicked('play', true)}
            onTouchStart={() => this.setBtnClicked('play', true)}
            onMouseUp={() => this.setBtnClicked('play', false)}
            onTouchEnd={() => this.setBtnClicked('play', false)}
            onMouseLeave={() => this.setBtnClicked('play', false)}
            onTouchMove={() => this.setBtnClicked('play', false)}
            style={this.getBtnStyle('play')}
          >
            <PlayButton
              playing={playing}
              togglePlay={togglePlay}
              loading={trackLoading}
              width={35}
            />
          </div>
          {/* https://stackoverflow.com/questions/21009821/how-to-impliment-a-onmousedown-and-onmouseup-on-a-touch-screen-iphone */}
          <div
            className="PlayerControls-btn-container next"
            onClick={() => goToTrack('next')}
            onMouseDown={() => this.setBtnClicked('next', true)}
            onTouchStart={() => this.setBtnClicked('next', true)}
            onMouseUp={() => this.setBtnClicked('next', false)}
            onTouchEnd={() => this.setBtnClicked('next', false)}
            onMouseLeave={() => this.setBtnClicked('next', false)}
            onTouchMove={() => this.setBtnClicked('next', false)}
            style={this.getBtnStyle('next')}
          >
            <img
              src={nextBtn}
              className="PlayerControls-btn PlayerControls-next-btn"
              alt="next-btn"
              draggable={false}
            />
          </div>
        </div>
        <Responsive minWidth={950}>
          <div
            className="PlayerControls-btn-container repeat"
            onClick={toggleRepeat}
            style={getActiveStyle(repeat)}
          >
            <img
              src={repeatBtn}
              className="PlayerControls-btn PlayerControls-repeat-btn"
              alt="repeat-btn"
              draggable={false}
            />
          </div>
          <div className="PlayerControls-time-and-seek">
            <span className="PlayerControls-time">{currentTime.before}</span>
            <SeekBar currentTime={currentTime.raw} />
            <span className="PlayerControls-time">{currentTime.after}</span>
          </div>
        </Responsive>
      </div>
    );
  }
}

export default PlayerControls;
