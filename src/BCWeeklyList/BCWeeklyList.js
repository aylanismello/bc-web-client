import React from 'react';
import BCWeeklyItem from '../BCWeeklyItem';
import './BCWeeklyList.scss';

const BCWeeklyList = ({
 playlists, activePlaylistIdx, updateActivePlaylist, playTrack
}) => {
  return (
    <div className="BCWeeklyList">
      {playlists.map((playlist, idx) => (
        <BCWeeklyItem
          playlist={playlist}
          playTrack={playTrack}
          active={activePlaylistIdx === idx}
          key={idx}
          idx={idx}
          setAsActiveItem={updateActivePlaylist}
        />
      ))}
    </div>
  );
};

export default BCWeeklyList;
