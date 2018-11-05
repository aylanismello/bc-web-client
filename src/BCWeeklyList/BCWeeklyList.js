import React from 'react';
import BCWeeklyItem from '../BCWeeklyItem';
import './BCWeeklyList.scss';

const BCWeeklyList = ({ playlists, activePlaylistIdx, updateActivePlaylist }) => {
  return (
    <div className="BCWeeklyList">
      {playlists.map((playlist, idx) => (
        <BCWeeklyItem
          playlist={playlist}
          active={activePlaylistIdx === idx}
          key={idx}
          idx={idx}
          setAsActiveItem={() => {
            updateActivePlaylist(idx);
          }}
        />
      ))}
    </div>
  );
};

export default BCWeeklyList;
