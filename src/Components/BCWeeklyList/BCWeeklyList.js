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
  incrementCollectionImagesLoaded,
  canShowTracklist
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
            active={activeCollectionIdx === idx}
            playing={playing}
            canShowTracklist={canShowTracklist}
            key={idx}
            idx={idx}
            incrementCollectionImagesLoaded={incrementCollectionImagesLoaded}
            setAsActiveItem={updateActiveCollection}
          />
        ))}
      </div>
    </div>
  );
};

export default BCWeeklyList;
