import React from "react";
import "./EQPlayButton.scss";
import PlayButton from "../PlayButton";
import EQIcon from "../EQIcon";

class EQPlayButton extends React.Component {
  state = {
    hoveringOver: false
  };

  render() {
    const theProps = {
      ...this.props,
      loading: (this.props.playerOpen && this.props.loading.track)
    };
    return (
      <div
        className="EQPlayButton"
        onMouseEnter={() => this.setState({ hoveringOver: true })}
        onMouseLeave={() => this.setState({ hoveringOver: false })}
      >
        {this.state.hoveringOver ||
        this.props.loading.track ||
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
