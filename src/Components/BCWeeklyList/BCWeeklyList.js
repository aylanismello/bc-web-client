import React from 'react';
import BCWeeklyItem from '../BCWeeklyItem';
import './BCWeeklyList.scss';

const BCWeeklyList = ({
  collections,
  activeCollectionIdx,
  updateActiveCollection,
  playTrack,
  activeTrack,
  playing,
  handleModalOpen,
  scrollToCollection
}) => {
  return (
    <div className="BCWeeklyList">
      <div className="BCWeeklyList-grid">
        {collections.map((collection, idx) => (
          <BCWeeklyItem
            scrollToCollection={scrollToCollection}
            handleModalOpen={handleModalOpen}
            activeTrack={activeTrack}
            collection={collection}
            playTrack={playTrack}
            active={activeCollectionIdx === idx}
            playing={playing}
            key={idx}
            idx={idx}
            setAsActiveItem={updateActiveCollection}
          />
        ))}
      </div>
    </div>
  );
};

export default BCWeeklyList;
