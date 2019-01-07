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
const queryString = require("query-string");

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview
class BCWeekly extends React.Component {
  static scrollTocollection(collectionIdx) {
    // const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // if (width <= 950) {
    //   document.getElementById(`${collectionIdx}`).scrollIntoView();
    // }
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
    this.props.burnCartelPlayer.switchTocollection = (collectionIdx, collections) =>
      this.autoSwitchcollections(collectionIdx, collections);

    this.onLoadcollectionPlayed = false;
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
        this.onLoadcollectionIdx = this.getActivecollectionIdx(
          `weekly-${collection_num}`,
          collections
        );

        this.setState({ collections }, () => {
          BCWeekly.scrollTocollection(this.onLoadcollectionIdx);
        });

        this.onLoadcollectionWeekNum = collections[this.onLoadcollectionIdx].collection_num;
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
      const idx = this.getActivecollectionIdx(nextProps.match.params.bc_weekly_num);
      this.switchTocollection(idx, nextState.collections);
    }
  }

  getActivecollectionIdx(
    bc_weekly_num = this.props.match.params.bc_weekly_num,
    collections = this.state.collections
  ) {
    let activecollectionIdx = 0;

    if (BCWeekly.isValidUrlParam(bc_weekly_num)) {
      const collectionFromWeekNum = BCWeekly.weekHasBeenReleased(
        collections,
        bc_weekly_num
      );
      if (collectionFromWeekNum) {
        activecollectionIdx = collectionFromWeekNum.idx;
      }
    }
    return activecollectionIdx;
  }

  autoSwitchcollections(collectionIdx, collections) {
    this.props.history.push(`/weekly-${collections[collectionIdx].collection_num}`);
  }

  switchTocollection(collectionIdx, collections, playOnLoad = true) {
    // this is a combo FETCH + PLAY operation
    if (!collections[collectionIdx].tracks) {
      this.fetchcollectionTracks(collectionIdx, collections, playOnLoad);
    } else {
      this.props.burnCartelPlayer.playcollection(
        collections[collectionIdx],
        collections
      );
    }
  }

  fetchcollectionTracks(collectionIdx, collections, playOnLoad) {

    this.props.setLoading('collectionTracks', true);
    
    axios
      .get(`${baseUrl}/collections/${collections[collectionIdx].id}/tracks`)
      .then(({ data }) => {
        const { tracks } = data.data.collection;

        const newcollection = {
          ...this.state.collections[collectionIdx],
          // hack to only take in 10 since we don't have the real content on the DB yet
          // tracks: tracks.slice(0, 10)
          tracks
        };

        if (playOnLoad) {
          this.props.burnCartelPlayer.playcollection(newcollection, collections);
        }

        const oldcollections = this.state.collections;
        this.setState({
          collections: [
            ...oldcollections.slice(0, collectionIdx),
            newcollection,
            ...oldcollections.slice(collectionIdx + 1, oldcollections.length)
          ]
        }, () => {
          BCWeekly.scrollTocollection(collectionIdx);
          this.props.setLoading('collectionTracks', false);
        });
        
      })
      .catch(error => {
        this.props.setError(error.message);
        this.props.setLoading('collectionTracks', false);
      });
  }

  playOnLoadcollectionIfNeeded(collection_num) {
    if (!this.onLoadcollectionPlayed && this.onLoadcollectionWeekNum === collection_num) {
      this.onLoadcollectionPlayed = true;
      this.switchTocollection(this.onLoadcollectionIdx, this.state.collections);
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
            if (this.props.playerOpen) {
              this.props.togglePlay();
            } else {
              this.switchTocollection(0, this.state.collections);
            }
          }}
        />
        {this.props.loading.collections ? (
          <BCLoading />
        ) : (
          <div className="BCWeekly-content-container">
            {/* <div className="BCWeekly-content"> */}
            <Wrapper>
              <Responsive minWidth={950}>
                <BCSpotlightItem
                  collection={this.state.collections[this.getActivecollectionIdx()]}
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
                activecollectionIdx={this.getActivecollectionIdx()}
                loadingcollectionTracks={this.props.loading.collectionTracks}
                playTrack={(track, collection) => {
                  this.playTrack(track, collection);
                }}
                updateActivecollection={collection_num => {
                  this.playOnLoadcollectionIfNeeded(collection_num);
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
