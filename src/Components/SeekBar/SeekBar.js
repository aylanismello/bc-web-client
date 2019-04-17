import React from 'react';
import styled from 'styled-components';

// m.dotdev.co/how-to-build-an-audio-player-with-html5-and-the-progress-element-487cbbbaebfc

const SeekBarStyle = styled.div`
  text-align: center;
  width: 100%;

  progress,
  progress[role] {
    /* Turns off styling - not usually needed, but good to know. */
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;

    /* gets rid of default border in Firefox and Opera. */
    border: none;

    /* Needs to be in here for Safari polyfill so background images work as expected. */
    background-size: auto;

    /* Dimensions */
    width: 100%;
    border: none;
    height: 0.5rem;
    border-radius: ${(props) => props.showTopSeekBar ? '0px' : '300px'};


    /* more */
    
    position: ${(props) => props.showTopSeekBar ? 'absolute' : ''};
    left: ${(props) => props.showTopSeekBar ? '0' : ''}; 
    right: ${(props) => props.showTopSeekBar ? '0' : ''};
  }

  progress::-webkit-progress-bar {
    background: #626970;
    border-radius: ${(props) => props.showTopSeekBar ? '0px' : '300px'};
    
  }
  progress::-webkit-progress-value {
    background: #e54ea3;
    border-radius: ${(props) => props.showTopSeekBar ? '0px' : '300px'};
  }

  progress::-moz-progress-bar {
    background: #e54ea3;
    border-radius: ${(props) => props.showTopSeekBar ? '0px' : '300px'};
  }

  progress::-moz-progress-value {
    background: #626970;
    border-radius: ${(props) => props.showTopSeekBar ? '0px' : '300px'};
    
  }

  progress:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 949px) {
    progress[value] {
      /* height: 1.2rem; */
      height: 0.5rem;
    }
  }
`;

class SeekBar extends React.Component {
  componentDidMount() {
    const progress = document.getElementById('seek-obj');
    progress.addEventListener('click', event => {
      const { offsetWidth } = event.target;
      const { offsetX } = event;
      const percent = offsetX / offsetWidth;
      window.sc.setTime(percent * window.sc.audio.duration);
    });
  }

  getStyle() {
    return this.props.showTopSeekBar ? { position: 'absolute' } : {};
  }

  render() {
    const { currentTime } = this.props;
    const value = currentTime / window.sc.audio.duration;
    return (
      <SeekBarStyle style={this.getStyle()} showTopSeekBar={this.props.showTopSeekBar}>
        <div className="player-controls scrubber">
          <progress id="seek-obj" value={value || 0} max="1" />
        </div>

      </SeekBarStyle>
    );
  }
}

SeekBar.defaultProps = {
  showTopSeekBar: false
};

export default SeekBar;
