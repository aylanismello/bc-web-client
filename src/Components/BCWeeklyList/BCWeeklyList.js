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
  showTracklist,
  loadingCollectionTracks,
  show,
  playingCollectionNum,
  loadingTrack
}) => {
  let style = {};
  if (!show) {
    style = { display: 'none' };
  }
  return (
    <div className="BCWeeklyList" style={style}>
      <div className="BCWeeklyList-grid">
        {collections.map((collection, idx) => (
          <BCWeeklyItem
            handleModalOpen={handleModalOpen}
            activeTrack={activeTrack}
            collection={collection}
            playTrack={playTrack}
            // match by id
            active={activeCollectionIdx === idx}
            playing={playing}
            showTracklist={showTracklist}
            key={idx}
            playingCollectionNum={playingCollectionNum}
            idx={idx}
            incrementCollectionImagesLoaded={incrementCollectionImagesLoaded}
            updateActiveCollection={updateActiveCollection}
            loadingTrack={loadingTrack}
            loadingCollectionTracks={loadingCollectionTracks}
          />
        ))}
      </div>
    </div>
  );
};

export default BCWeeklyList;
