import React from 'react';
import copy from 'copy-to-clipboard';
import PlayButton from '../PlayButton';
import closeIcon from './i-remove.svg';
import chevronIcon from './ic_chevron.svg';
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
      playingCollection,
      isSideMenu
    } = this.props;

    if (!(collection && collection.tracks)) return null;

    const style = show ? {} : { display: 'none' };

    let hostname = 'www.burncartel.com';
    if (!window.location.hostname.includes('burncartel')) {
      hostname = 'localhost:3000';
    }

    const url = `${hostname}/#/weekly-${collectionNum}?from=link`;
    const contentTop = isSideMenu
      ? {
          height: '5rem',
          boxShadow: '0 2px 20px 0 rgba(0, 0, 0, 0.2)',
          padding: '1.5rem 1.2rem',
          display: 'flex'
        }
      : { height: '10rem' };
    const contentMiddle = isSideMenu
      ? { padding: '0 3rem', marginTop: '1.5rem' }
      : { padding: '0 1rem 0 1rem' };
    const contentBottom = isSideMenu
      ? { padding: '0 3rem 2rem 3rem ' }
      : { padding: '0 16px 2rem 16px' };

    return (
      <div
        className="CollectionDetail"
        style={style}
        onClick={e => {
          if (e.target.className === 'CollectionDetail') this.closeModal();
        }}
      >
        <div
          className="CollectionDetail-content"
          style={isSideMenu ? { paddingBottom: '10rem' } : {}}
        >
          <div className="CollectionDetail-content-top" style={contentTop}>
            <div
              className="CollectionDetail-close-icon-container"
              onClick={() => this.closeModal()}
              style={isSideMenu ? { marginRight: '2.5rem' } : {}}
            >
              <img
                src={isSideMenu ? chevronIcon : closeIcon}
                alt="CloseIcon"
                className="CollectionDetail-close-icon"
              />
            </div>
            <div className="CollectionDetail-content-header">
              <BCLogo />
            </div>
          </div>

          <div
            className="CollectionDetail-content-middle"
            style={contentMiddle}
          >
            <div className="CollectionDetail-cover-text">
              <span className="CollectionDetail-cover-text-header">
                {' '}
                Week {collectionNum}{' '}
              </span>
              <div className="CollectionDetail-line" />
              <span className="CollectionDetail-cover-text-subheader">
                {' '}
                Burn Cartel Weekly{' '}
              </span>
            </div>
            <div className="CollectionDetail-image-container">
              <BCProgressiveImage
                isCollectionItem
                isVisible={show}
                artwork_url={collection.artwork_url}
                max_width={600}
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
          <div
            className="CollectionDetail-content-bottom"
            style={contentBottom}
          >
            {!loadingCollectionTracks && (
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
