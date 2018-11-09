import React from "react";
import BCWeeklyItem from "../BCWeeklyItem";
import "./BCWeeklyList.scss";

const BCWeeklyList = ({
  playlists,
  activePlaylistIdx,
  updateActivePlaylist,
  playTrack,
  activeTrack
}) => {
  return (
    <div className="BCWeeklyList">
      <div className="BCWeeklyList-grid">
        {playlists.map((playlist, idx) => (
          <BCWeeklyItem
            activeTrack={activeTrack}
            playlist={playlist}
            playTrack={playTrack}
            active={activePlaylistIdx === idx}
            key={idx}
            idx={idx}
            setAsActiveItem={updateActivePlaylist}
          />
        ))}
      </div>
    </div>
  );
};

export default BCWeeklyList;
