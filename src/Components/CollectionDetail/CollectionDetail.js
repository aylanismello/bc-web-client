import React from 'react';
import copy from 'copy-to-clipboard';
import PlayButton from '../PlayButton';
import closeIcon from './i-remove.svg';
import chevronIcon from './ic_chevron.svg';
import BCLogo from '../BCLogo';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import BCProgressiveImage from '../BCProgressiveImage';
import './CollectionDetail.scss';
import { getWeeklyItemTexts } from '../../helpers';


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
    let contentTop = {
      boxShadow: '0 2px 20px 0 rgba(0, 0, 0, 0.2)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: '1000000',
      background: '#191925'
    };

    contentTop = isSideMenu
      ? {
          ...contentTop,
          height: '5rem',
          padding: '1.5rem 1.2rem',
          display: 'flex',
          // setting the width like this is a bit janky
          width: '325px'
        }
      : {
          ...contentTop,
          height: '8rem',
          padding: '0 2rem',
          display: 'flex',
          // -webkit-fill-available
          // width: '100%'
          width: '-webkit-fill-available'
        };
    const contentMiddle = isSideMenu
      ? { padding: '0 3rem', marginTop: '10rem' }
      : { padding: '0 1rem 0 1rem', marginTop: '10rem' };
    const contentBottom = isSideMenu
      ? { padding: '0 3rem 2rem 3rem ' }
      : { padding: '0 16px 2rem 16px' };

    const texts = getWeeklyItemTexts(collection);

    return (
      <div
        className="CollectionDetail"
        style={style}
        onClick={e => {
          if (e.target.className === "CollectionDetail") this.closeModal();
        }}
      >
        <div
          className="CollectionDetail-content"
          style={isSideMenu ? { paddingBottom: "10rem" } : {}}
        >
          <div className="CollectionDetail-content-top" style={contentTop}>
            <div
              className="CollectionDetail-close-icon-container"
              onClick={() => this.closeModal()}
              style={
                isSideMenu
                  ? { marginRight: "2.5rem" }
                  : {
                      right: "0",
                      top: "50%",
                      transform: "translate(-50%, -50%)"
                    }
              }
            >
              <img
                src={isSideMenu ? chevronIcon : closeIcon}
                alt="CloseIcon"
                className="CollectionDetail-close-icon"
              />
            </div>
            <div
              className="CollectionDetail-content-header"
              style={
                isSideMenu
                  ? {}
                  : {
                      // position: 'absolute',
                      // top: '50%',
                      // left: '30%',
                      // transform: 'translate(-50%, -50%)'
                    }
              }
            >
              <BCLogo />
            </div>
          </div>

          <div
            className="CollectionDetail-content-middle"
            style={contentMiddle}
          >
            <div className="CollectionDetail-cover-text">
              <span className="CollectionDetail-cover-text-header">
                {texts[0]}
              </span>
              <div className="CollectionDetail-line" />
              <span className="CollectionDetail-cover-text-subheader">
                {texts[1]}
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
            <div className="CollectionDetail-description">
              {collection.description}
            </div>

            {!loadingCollectionTracks && (
              <div>
                <BCWeeklyTracklist
                  idx={idx}
                  hasMix
                  trackLoading={trackLoading}
                  playing={playingCollection}
                  tracks={collection.tracks}
                  activeTrack={activeTrack}
                  playTrack={playTrack}
                  collection={collection}
                />
              </div>
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
                  this.state.clickedCopy
                    ? {}
                    : { textDecoration: "underline" }
                }
                onClick={() => {
                  if (!this.state.clickedCopy) {
                    copy(url);
                    this.setState({ clickedCopy: true });
                  }
                }}
              >
                {this.state.clickedCopy
                  ? "Link copied!"
                  : "Copy playlist link"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CollectionDetail;
