import React from 'react';
import closeIcon from './i-remove.svg';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import './CollectionModal.scss';

const CollectionModal = ({
  modalOpen,
  collectionNum,
  closeModal,
  activeTrack,
  playTrack,
  collection,
  idx
}) => {
  if (!modalOpen) {
    return null;
  }

  return (
    <div
      className="CollectionModal"
      onClick={e => {
        if (e.target.className === 'CollectionModal') closeModal();
      }}
    >
      <div className="CollectionModal-content">
        <div className="CollectionModal-close-icon-container">
          <img
            src={closeIcon}
            alt="CloseIcon"
            className="CollectionModal-close-icon"
            onClick={closeModal}
          />
        </div>
        <div className="CollectionModal-content-top">
          <span className="CollectionModal-MainText">WEEK {collectionNum}</span>
        </div>
        <div className="CollectionModal-content-bottom">
          <BCWeeklyTracklist
            idx={idx}
            tracks={collection.tracks.slice(1)}
            activeTrack={activeTrack}
            playTrack={playTrack}
            collection={collection}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;
