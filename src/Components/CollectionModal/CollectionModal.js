import React from 'react';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock';
import closeIcon from './i-remove.svg';
import BCLogo from '../BCLogo';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import BCProgressiveImage from '../BCProgressiveImage';
import './CollectionModal.scss';
// , () => {
//       if (modalOpen) {
//         this.targetElement = document.querySelector('.CollectionModal-content');
//         debugger;
//         if (this.targetElement) disableBodyScroll(this.targetElement);
//         // document.body.classList.add('modal-open');
//       } else {
//         // debugger;
//         // this.targetElement = document.querySelector('.CollectionModal');
//         clearAllBodyScrollLocks();
//         // enableBodyScroll(this.targetElement);
//         // document.body.classList.remove('modal-open');
//       }

class CollectionModal extends React.Component {
  targetElement = null;

  componentDidMount() {
    this.targetElement = document.querySelector('.CollectionModal-content');
  }
  
  componentWillUpdate(nextProps) {
    // on open
    if (!this.props.modalOpen && nextProps.modalOpen) {
      disableBodyScroll(this.targetElement);
      // on close
    } else if (this.props.modalOpen && !nextProps.modalOpen) {
      enableBodyScroll(this.targetElement);
    }
  }

  render() {
    const {
      modalOpen,
      collectionNum,
      closeModal,
      activeTrack,
      playTrack,
      collection,
      idx,
      loadingCollectionTracks
    } = this.props;

    if (!modalOpen) return null;

    return (
      <div
        className="CollectionModal"
        onClick={e => {
          if (e.target.className === 'CollectionModal') closeModal();
        }}
      >
        <div className="CollectionModal-content">
          <div className="CollectionModal-content-top">
            <div className="CollectionModal-close-icon-container">
              <img
                src={closeIcon}
                alt="CloseIcon"
                className="CollectionModal-close-icon"
                onClick={closeModal}
              />
            </div>
            <div className="CollectionModal-content-header">
              <BCLogo />
            </div>
          </div>

          <div className="CollectionModal-content-middle">
            <div className="CollectionModal-cover-text">
              <h4> BURN CARTEL WEEKLY </h4>
              <div className="CollectionModal-line" />
              <h4> WEEK {collectionNum} </h4>
            </div>
            <div className="CollectionModal-image-container">
              <BCProgressiveImage
                isCollectionItem
                artwork_url={collection.artwork_url}
                max_width={600}
              />
            </div>
          </div>
          <div className="CollectionModal-content-bottom">
            {loadingCollectionTracks ? null : (
              <BCWeeklyTracklist
                idx={idx}
                tracks={collection.tracks.slice(1)}
                activeTrack={activeTrack}
                playTrack={playTrack}
                collection={collection}
              />
            )}
            <div className="CollectionModal-explore-more-container">
              <button
                className="CollectionModal-explore-more"
                onClick={closeModal}
              >
                DISCOVER MORE MIXES
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionModal;
