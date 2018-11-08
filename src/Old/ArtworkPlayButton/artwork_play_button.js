import React from "react";
import PlayButton from "../PlayButton";
import "./artwork_play_button.scss";

const ArtworkPlayButton = ({
  track,
  src,
  playing,
  togglePlay,
  playingTrackId
}) => (
  <div className="ArtworkPlayButton">
    <img src={src} />
    <PlayButton
      playing={playing}
      playingTrack={track}
      playingTrackId={playingTrackId}
      togglePlay={togglePlay}
      isGlobal={false}
    />
  </div>
);

export default ArtworkPlayButton;
