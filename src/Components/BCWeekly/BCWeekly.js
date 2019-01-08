import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import Responsive from 'react-responsive';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';
import BCLoading from '../BCLoading';
import Wrapper from '../Wrapper';
import BCSpotlightItem from '../BCSpotlightItem';
import { baseUrl } from '../../config';
import './BCWeekly.scss';

const queryString = require('query-string');

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview
class BCWeekly extends React.Component {
  static scrollToCollection(collectionIdx, setPlayerOpen) {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (width <= 950) {
      setPlayerOpen();
      document.getElementById(`${collectionIdx}`).scrollIntoView();
    }
  }

  static collectionAsHash(arrcollections) {
    const collections = {};
    arrcollections.forEach((collection, idx) => {
      collections[collection.collection_num] = { ...collection, idx };
    });
    return collections;
  }

  static isValidUrlParam(param) {
    return /^weekly-[0-9]+$/.test(param);
  }

  static weekHasBeenReleased(collections, bc_weekly_num) {
    const weekNum = parseInt(bc_weekly_num.split('-')[1], 10);
    return BCWeekly.collectionAsHash(collections)[weekNum];
  }

  constructor(props) {
    super(props);
    this.props.burnCartelPlayer.switchToCollection = (collectionIdx, collections) =>
      this.autoSwitchCollections(collectionIdx, collections);

    this.onLoadCollectionPlayed = false;
  }

  state = Object.freeze({
    collections: [],
    isFromEmail: false
  });

  componentWillMount() {
    const { bc_weekly_num } = this.props.match.params;
    const queryParams = queryString.parse(this.props.location.search);

    if (queryParams.from && queryParams.from === 'email') {
      this.setState({ isFromEmail: true });
    }

    const weekNum = parseInt(bc_weekly_num.split('-')[1], 10);
    // we need some error handling here


    axios
      .get(`${baseUrl}/collections`, { params: { collection_num: weekNum } })
      .then(({ data }) => {
        const { collections, collection_num } = data.data;

        this.props.setLoading('collections', false);
        this.onLoadCollectionIdx = this.getActiveCollectionIdx(
          `weekly-${collection_num}`,
          collections
        );

        this.setState({ collections }, () => {
          if (queryParams.from) {
            BCWeekly.scrollToCollection(this.onLoadCollectionIdx, this.props.setPlayerOpen);
          }
        });

        this.onLoadCollectionWeekNum = collections[this.onLoadCollectionIdx].collection_num;
      })
      .catch(error => {
        this.props.setError(error.message);
      });
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.match.params.bc_weekly_num !==
      nextProps.match.params.bc_weekly_num
    ) {
      const idx = this.getActiveCollectionIdx(nextProps.match.params.bc_weekly_num);
      this.switchToCollection(idx, nextState.collections);
    }
  }

  getActiveCollectionIdx(
    bc_weekly_num = this.props.match.params.bc_weekly_num,
    collections = this.state.collections
  ) {
    let activeCollectionIdx = 0;

    if (BCWeekly.isValidUrlParam(bc_weekly_num)) {
      const collectionFromWeekNum = BCWeekly.weekHasBeenReleased(
        collections,
        bc_weekly_num
      );
      if (collectionFromWeekNum) {
        activeCollectionIdx = collectionFromWeekNum.idx;
      }
    }
    return activeCollectionIdx;
  }

  autoSwitchCollections(collectionIdx, collections) {
    this.props.history.push(`/weekly-${collections[collectionIdx].collection_num}`);
  }

  switchToCollection(collectionIdx, collections, playOnLoad = true) {
    // this is a combo FETCH + PLAY operation
    if (!collections[collectionIdx].tracks) {
      this.fetchCollectionTracks(collectionIdx, collections, playOnLoad);
    } else {
      this.props.burnCartelPlayer.playCollection(
        collections[collectionIdx],
        collections
      );
    }
  }

  fetchCollectionTracks(collectionIdx, collections, playOnLoad) {
    this.props.setLoading('collectionTracks', true);

    axios
      .get(`${baseUrl}/collections/${collections[collectionIdx].id}/tracks`)
      .then(({ data }) => {
        const { tracks } = data.data.collection;

        const newCollection = {
          ...this.state.collections[collectionIdx],
          // hack to only take in 10 since we don't have the real content on the DB yet
          // tracks: tracks.slice(0, 10)
          tracks
        };

        if (playOnLoad) {
          this.props.burnCartelPlayer.playCollection(newCollection, collections);
        }

        const oldCollections = this.state.collections;
        this.setState({
          collections: [
            ...oldCollections.slice(0, collectionIdx),
            newCollection,
            ...oldCollections.slice(collectionIdx + 1, oldCollections.length)
          ]
        }, () => {
          // BCWeekly.scrollToCollection(collectionIdx);
          this.props.setLoading('collectionTracks', false);
        });
      })
      .catch(error => {
        this.props.setError(error.message);
        this.props.setLoading('collectionTracks', false);
      });
  }

  playOnLoadCollectionIfNeeded(collection_num) {
    if (!this.onLoadCollectionPlayed && this.onLoadCollectionWeekNum === collection_num) {
      this.onLoadCollectionPlayed = true;
      this.switchToCollection(this.onLoadCollectionIdx, this.state.collections);
    }
  }

  playTrack(track, collection) {
    this.props.burnCartelPlayer.playTrack(
      track,
      collection,
      this.state.collections,
      this.props.setPlaying
    );
  }

  render() {
    const { history, track } = this.props;
    return (
      <div className="BCWeekly">
        <SplashBanner
          isFromEmail={this.state.isFromEmail}
          loading={this.props.loading}
          playing={this.props.playing}
          playerOpen={this.props.playerOpen}
          togglePlay={() => {
            // this is really awkwadly phrased and implemented (rethink)
            if (this.props.playerForcedOpen) {
              this.switchToCollection(0, this.state.collections);
              this.props.disablePlayerForcedOpen();
            } else if (this.props.playerOpen) {
              this.props.togglePlay();
            } else {
              this.switchToCollection(0, this.state.collections);
            }
          }}
        />
        {this.props.loading.collections ? (
          <BCLoading />
        ) : (
          <div className="BCWeekly-content-container">
            <Wrapper>
              <Responsive minWidth={950}>
                <BCSpotlightItem
                  collection={this.state.collections[this.getActiveCollectionIdx()]}
                  playing={this.props.playing}
                  trackLoading={this.props.trackLoading}
                  width={600}
                  track={track}
                  playTrack={(track, collection) => {
                    this.playTrack(track, collection);
                  }}
                />
              </Responsive>
              <BCWeeklyList
                handleModalOpen={this.props.handleModalOpen}
                collections={this.state.collections}
                playing={this.props.playing}
                activeTrack={track}
                activeCollectionIdx={this.getActiveCollectionIdx()}
                loadingCollectionTracks={this.props.loading.collectionTracks}
                playTrack={(track, collection) => {
                  this.playTrack(track, collection);
                }}
                updateActiveCollection={collection_num => {
                  this.playOnLoadCollectionIfNeeded(collection_num);
                  history.push(`/weekly-${collection_num}`);
                }}
              />
            </Wrapper>
          </div>
        )}
      </div>
    );
  }
}
// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(BCWeekly);
