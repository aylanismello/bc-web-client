import React from "react";
import Responsive from "react-responsive";
import PlayButton from "../PlayButton";
import "./PlayerControls.scss";
import nextBtn from "./assets/next.svg";
import prevBtn from "./assets/prev.svg";
import repeatBtn from "./assets/repeat.svg";
import visualizerBtn from "./assets/chart-bars.svg";

const getActiveStyle = active =>
  active
    ? { filter: "invert(.5) sepia(1) saturate(19) hue-rotate(300deg)" }
    : {};

const PlayerControls = ({
  playing,
  togglePlay,
  goToTrack,
  repeat,
  visualize,
  toggleRepeat,
  toggleVisualize,
  trackLoading
}) => (
  <div className="PlayerControls">
    <Responsive minWidth={950}>
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
    </Responsive>

    <div
      className="PlayerControls-btn-container prev"
      onClick={() => goToTrack("prev")}
    >
      <img
        src={prevBtn}
        className="PlayerControls-btn PlayerControls-prev-btn"
        alt="prev-btn"
      />
    </div>

    <PlayButton
      playing={playing}
      togglePlay={togglePlay}
      loading={trackLoading}
    />

    <div
      className="PlayerControls-btn-container next"
      onClick={() => goToTrack("next")}
    >
      <img
        src={nextBtn}
        className="PlayerControls-btn PlayerControls-next-btn"
        alt="next-btn"
      />
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
        />
      </div>
    </Responsive>
  </div>
);

export default PlayerControls;
