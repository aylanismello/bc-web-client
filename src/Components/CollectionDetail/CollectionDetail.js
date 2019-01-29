import React from 'react';
import copy from 'copy-to-clipboard';
import PlayButton from '../PlayButton';
import closeIcon from './i-remove.svg';
import BCLogo from '../BCLogo';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import BCProgressiveImage from '../BCProgressiveImage';
import './CollectionDetail.scss';

class CollectionDetail extends React.Component {
  state = {
    clickedCopy: false
  };

  closeModal() {
    this.setState({ clickedCopy: false });
    this.props.closeModal();
  }

  render() {
    const {
      collectionNum,
      activeTrack,
      playTrack,
      collection,
      idx,
      loadingCollectionTracks,
      show,
      trackLoading,
      togglePlay,
      playingCollection
    } = this.props;

    if (!(collection && collection.tracks)) return null;

    const style = show ? {} : { display: 'none' };

    let hostname = 'www.burncartel.com';
    if (!window.location.hostname.includes('burncartel')) {
      hostname = 'localhost:3000';
    }

    const url = `${hostname}/#/weekly-${collectionNum}?from=link`;
    return (
      <div
        className="CollectionDetail"
        style={style}
        onClick={e => {
          if (e.target.className === 'CollectionDetail') this.closeModal();
        }}
      >
        <div className="CollectionDetail-content">
          <div className="CollectionDetail-content-top">
            <div className="CollectionDetail-close-icon-container">
              <img
                src={closeIcon}
                alt="CloseIcon"
                className="CollectionDetail-close-icon"
                onClick={() => this.closeModal()}
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
                isCollectionDetailImage
              />
              <div className="CollectionDetail-play-button-container">
                <PlayButton
                  playing={playingCollection}
                  togglePlay={togglePlay}
                  loading={trackLoading}
                  width={60}
                />
              </div>
            </div>
          </div>
          <div className="CollectionDetail-content-bottom">
            {loadingCollectionTracks ? null : (
              <BCWeeklyTracklist
                idx={idx}
                tracks={collection.tracks}
                activeTrack={activeTrack}
                playTrack={playTrack}
                collection={collection}
              />
            )}
            <div className="CollectionDetail-explore-more-container">
              <button
                className="CollectionDetail-explore-more"
                onClick={() => this.closeModal()}
              >
                DISCOVER MORE MUSIC
              </button>
            </div>
            <div className="CollectionDetail-copy">
              <span
                style={
                  this.state.clickedCopy ? {} : { textDecoration: 'underline' }
                }
                onClick={() => {
                  if (!this.state.clickedCopy) {
                    copy(url);
                    this.setState({ clickedCopy: true });
                  }
                }}
              >
                {this.state.clickedCopy ? 'Link copied!' : 'Copy playlist link'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionDetail;
