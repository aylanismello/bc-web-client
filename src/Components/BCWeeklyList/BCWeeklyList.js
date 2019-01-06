import React from "react";
import BCWeeklyItem from "../BCWeeklyItem";
import "./BCWeeklyList.scss";

const BCWeeklyList = ({
  playlists,
  activePlaylistIdx,
  updateActivePlaylist,
  playTrack,
  activeTrack,
  playing,
  handleModalOpen,
  loadingPlaylistTracks
}) => {
  return (
    <div className="BCWeeklyList">
      <div className="BCWeeklyList-grid">
        {playlists.map((playlist, idx) => (
          <BCWeeklyItem
            handleModalOpen={handleModalOpen}
            activeTrack={activeTrack}
            playlist={playlist}
            playTrack={playTrack}
            active={activePlaylistIdx === idx}
            playing={playing}
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
