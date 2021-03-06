import React from 'react';
import copy from 'copy-to-clipboard';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import soundcloudIcon from '@iconify/icons-entypo-social/soundcloud';

import PlayButton from '../PlayButton';
import closeIcon from './i-remove.svg';
import chevronIcon from './ic_chevron.svg';
import BCLogo from '../BCLogo';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import BCProgressiveImage from '../BCProgressiveImage';
import './CollectionDetail.scss';
import { getWeeklyItemTexts } from '../../helpers';

// const Divider = styled.div`
//   width: auto;
//   border: solid 1px #262632;
//   margin: 1.5rem 0 1.5rem 0;
// `;

const CollectionDetailDescription = styled.div`
  /* color: $bc-white; */
  /* @include bc-text(); */
  ${({ theme: { mixins } }) => mixins.text} /* color: #dcdcdc; */
  font-size: 1.4rem;
  line-height: 1.5;
  padding: 2rem 1rem 0 1rem;
`;

const Tracklist = styled.div`
  font-weight: normal;
  color: #dcdcdc;
  font-size: 1.2em;
  line-height: 1.5;
  padding: 0 0.6em 1em 0.6em;
`;

const TracklistItem = styled.div`
  font-family: ${({ theme: { fonts } }) => fonts.font1};
  padding: 0.5em 0;
`;

const IconImage = styled.img`
  width: 100%;
  height: auto;
`;

const ExternalCuratedSourcesContainer = styled.div`
  display: flex;
`;

const IconContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

class CollectionDetail extends React.Component {
  state = {
    clickedCopy: false,
    showTracklist: false,
  };

  closeModal() {
    this.setState({ clickedCopy: false, showTracklist: false });
    this.props.closeModal();
  }

  toggleShowTracklist() {
    window.logEvent('SHOW_TRACKLIST');
    this.setState({ showTracklist: !this.state.showTracklist });
  }

  renderTracklistOptions() {
    return (
      <div className="CollectionDetail-full-tracklist-container">
        {this.state.showTracklist ? (
          <Tracklist className="CollectionDetail-tracklist">
            {this.props.collection.tracklist.split('\n').map(tracklistItem => (
              <TracklistItem className="TracklistItem">{tracklistItem}</TracklistItem>
            ))}
          </Tracklist>
        ) : (
          <div className="CollectionDetail-explore-more-container">
            {/* <button
              className="CollectionDetail-explore-more"
              onClick={() => this.toggleShowTracklist()}
            >
              VIEW ENTIRE TRACKLIST
            </button> */}
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      collectionNum,
      openModal,
      activeTrack,
      playTrack,
      collection,
      idx,
      loadingCollectionTracks,
      show,
      trackLoading,
      togglePlay,
      playingCollection,
      isSideMenu,
      setEpisodeTrack,
      guests,
    } = this.props;

    // TODO: change this to not have it be totally blank
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
      background: '#191925',
      height: '48px',
      padding: '12px 12px',
    };

    contentTop = isSideMenu
      ? {
          ...contentTop,
          display: 'flex', // setting the width like this is a bit janky
          // width: "325px",
          // WHAT UP - TO FIX SCROLLBAR
          width: '326px',
        }
      : {
          ...contentTop, // height: "8rem",
          // padding: "0 2rem",
          padding: '12px 20px',
          display: 'flex',
          // width: '100%'
          width: '-webkit-fill-available',
        };
    const contentMiddle = isSideMenu
      ? { padding: '0 3rem', marginTop: '10rem' }
      : { padding: '0 1rem 0 1rem', marginTop: '10rem' };
    const contentBottom = isSideMenu ? { padding: '2rem 3rem' } : { padding: '1rem 0 16px 0' };

    const texts = getWeeklyItemTexts(collection);
    const hasMix = collection.collection_type === 0;
    const { tracks } = collection;
    // const tracklists = [{ tracks }];
    let tracklists = [];

    if (hasMix && tracks && guests) {
      // leave out mix itself
      const finalTracks = tracks.slice(1, tracks.length);

      finalTracks.forEach(track => {
        const { dj_id } = track;

        const tracklistIdx = tracklists.findIndex(tracklist => tracklist.dj_id === track.dj_id);
        if (tracklistIdx === -1) {
          // INITALIZE TRACKLIST

          // MIGHT HAVE TO WAIT ON GUEST!
          const guest = guests[dj_id];

          tracklists.push({
            dj_id,
            tracks: [track],
            guest,
          });
        } else {
          tracklists[tracklistIdx].tracks.push(track);
        }
      });
    }

    if (!hasMix) {
      tracklists = [{ tracks }];
      window.currentMixImg = null;
    } else {
      window.currentMixImg = `https://res.cloudinary.com/burncartel/image/upload/c_scale,w_100/v1595040893/${collection.artwork_url}`;
    }

    console.log(collection);
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
              style={
                isSideMenu
                  ? { marginRight: '2.5rem' }
                  : {
                      right: '0',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
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
              style={isSideMenu ? { marginLeft: '20px' } : {}}
            >
              <BCLogo infoText={`[${texts[0]}]`} />
            </div>
          </div>

          <div className="CollectionDetail-content-middle" style={contentMiddle}>
            <div className="CollectionDetail-image-container">
              <BCProgressiveImage
                isCollectionItem
                isVisible={show}
                artwork_url={collection.artwork_url || collection.creator_avatar_url}
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

            <div
              className="CollectionDetail-cover-text"
              style={isSideMenu ? { paddingLeft: '2rem' } : {}}
            >
              <span className="CollectionDetail-cover-text-header">{texts[0]}</span>
              <div className="CollectionDetail-line" />
              {/* only do not show soundcloud link if it is rising, aka collection_type 1 */}

              {collection.collection_type !== 1 ? (
                <ExternalCuratedSourcesContainer>
                  <IconContainer>
                    <a
                      href={hasMix ? tracks[0].permalink_url : collection.creator_soundcloud_url}
                      target="_blank"
                    >
                      <Icon icon={soundcloudIcon} color="#6255FF" fontSize="35px" />
                    </a>
                  </IconContainer>
                </ExternalCuratedSourcesContainer>
              ) : (
                <span className="CollectionDetail-cover-text-subheader">{texts[1]}</span>
              )}
            </div>

            {collection.description && (
              <CollectionDetailDescription>{collection.description}</CollectionDetailDescription>
            )}
          </div>

          <div className="CollectionDetail-content-bottom" style={contentBottom}>
            {/* <Divider />
            <div className="CollectionDetail-description">
              <h3>
                Tracklist
              </h3>
            </div> */}
            {/* <div className="CollectionDetail-cover-art-info CollectionDetail-description ">
              <span className="before-handle">Cover Art by: </span>
              <span className="CollectionDetail-cover-art-handle">
                <a href="https://instagram.com/alexontrails" target="_blank">
                  @alex_on_trails
                </a>
              </span>
            </div> */}

            {!loadingCollectionTracks && (
              <div>
                <BCWeeklyTracklist
                  setEpisodeTrack={setEpisodeTrack}
                  idx={idx}
                  openModal={openModal}
                  hasMix={hasMix}
                  trackLoading={trackLoading}
                  playing={playingCollection}
                  tracks={collection.tracks}
                  tracklists={tracklists}
                  activeTrack={activeTrack}
                  playTrack={playTrack}
                  collection={collection}
                  collectionArtworkUrl={window.currentMixImg}
                />
              </div>
            )}
            {hasMix && tracks && this.renderTracklistOptions()}
            <div className="CollectionDetail-copy">
              <span
                style={this.state.clickedCopy ? {} : { textDecoration: 'underline' }}
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
