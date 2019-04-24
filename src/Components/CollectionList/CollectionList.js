import React from 'react';
import BCWeeklyItem from '../BCWeeklyItem';
import './CollectionList.scss';

const CollectionList = ({
  collections,
  activeCollectionId,
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
    <div className="CollectionList" style={style}>
      <div className="CollectionList-grid">
        {collections.map((collection, idx) => (
          <BCWeeklyItem
            handleModalOpen={handleModalOpen}
            activeTrack={activeTrack}
            collection={collection}
            playTrack={playTrack}
            // match by id
            active={activeCollectionId === collection.id}
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

export default CollectionList;