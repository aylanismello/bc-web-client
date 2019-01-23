import React from 'react';
import copy from 'copy-to-clipboard';
import closeIcon from './i-remove.svg';
import BCLogo from '../BCLogo';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import BCProgressiveImage from '../BCProgressiveImage';
import './CollectionDetail.scss';

class CollectionDetail extends React.Component {
  render() {
    const {
      collectionNum,
      closeModal,
      activeTrack,
      playTrack,
      collection,
      idx,
      loadingCollectionTracks
    } = this.props;

    let hostname = 'www.burncartel.com';
    if (!window.location.hostname.includes('burncartel')) {
      hostname = 'localhost:3000';
    }

    const url = `${hostname}/#/weekly-${collectionNum}?from=link`;
    return (
      <div
        className="CollectionDetail"
        onClick={e => {
          if (e.target.className === 'CollectionDetail') closeModal();
        }}
      >
        <div className="CollectionDetail-content">
          <div className="CollectionDetail-content-top">
            <div className="CollectionDetail-close-icon-container">
              <img
                src={closeIcon}
                alt="CloseIcon"
                className="CollectionDetail-close-icon"
                onClick={closeModal}
              />
            </div>
            <div className="CollectionDetail-content-header">
              <BCLogo />
            </div>
          </div>

          <div className="CollectionDetail-content-middle">
            <div className="CollectionDetail-cover-text">
              <h4> BURN CARTEL WEEKLY </h4>
              <div className="CollectionDetail-line" />
              <h4> WEEK {collectionNum} </h4>
            </div>
            <div className="CollectionDetail-image-container">
              <BCProgressiveImage
                isCollectionItem
                artwork_url={collection.artwork_url}
                max_width={600}
              />
            </div>
          </div>
          <div className="CollectionDetail-content-bottom">
            {loadingCollectionTracks ? null : (
              <BCWeeklyTracklist
                idx={idx}
                tracks={collection.tracks.slice(1)}
                activeTrack={activeTrack}
                playTrack={playTrack}
                collection={collection}
              />
            )}
            <div className="CollectionDetail-explore-more-container">
              <button
                className="CollectionDetail-explore-more"
                onClick={closeModal}
              >
                DISCOVER MORE MIXES
              </button>
            </div>
            <div className="CollectionDetail-copy">
              <span onClick={() => copy(url)}>COPY LINK</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionDetail;
