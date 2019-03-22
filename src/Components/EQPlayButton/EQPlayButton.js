import React from 'react';
import './EQPlayButton.scss';
import PlayButton from '../PlayButton';
import EQIcon from '../EQIcon';

class EQPlayButton extends React.Component {
  state = {
    hover: false
  };

  render() {
    const theProps = {
      ...this.props,
      loading: this.props.playerOpen && this.props.loading.track
    };

    return (
      <div
        className="EQPlayButton"
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        {this.state.hover ||
        this.props.loading.track ||
        !this.props.playing ||
        !this.props.playerOpen ? (
          <PlayButton {...theProps} />
        ) : (
          <EQIcon width={40} />
        )}
      </div>
    );
  }
}

export default EQPlayButton;
