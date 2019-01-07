import React from 'react';
import BCWeeklyItem from '../BCWeeklyItem';
import './BCWeeklyList.scss';

const BCWeeklyList = ({
  collections,
  activecollectionIdx,
  updateActivecollection,
  playTrack,
  activeTrack,
  playing,
  handleModalOpen,
  loadingcollectionTracks
}) => {
  return (
    <div className="BCWeeklyList">
      <div className="BCWeeklyList-grid">
        {collections.map((collection, idx) => (
          <BCWeeklyItem
            handleModalOpen={handleModalOpen}
            activeTrack={activeTrack}
            collection={collection}
            playTrack={playTrack}
            active={activecollectionIdx === idx}
            playing={playing}
            key={idx}
            idx={idx}
            setAsActiveItem={updateActivecollection}
          />
        ))}
      </div>
    </div>
  );
};

export default BCWeeklyList;
