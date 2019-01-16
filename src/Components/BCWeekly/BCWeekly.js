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
  constructor(props) {
    super(props);
    this.props.burnCartelPlayer.switchToCollection = (
      collectionIdx,
      collections
    ) => this.autoSwitchCollections(collectionIdx, collections);

    this.preselectedCollectionPlayed = false;
  }

  state = Object.freeze({
    isFromEmail: false,
    collectionImagesLoaded: 0
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
        this.preselectedCollectionIdx = this.props.getActiveCollectionIdx(
          `weekly-${collection_num}`,
          collections
        );

        const isPreselectedCollection = this.props.location.pathname.includes('weekly-');

        this.props.setCollections(
          collections,
          isPreselectedCollection,
          this.preselectedCollectionIdx
        );
        this.preselectedCollectionWeekNum =
          collections[this.preselectedCollectionIdx].collection_num;
      })
      .catch(error => {
        this.props.setError(error.message);
      });
  }

  componentWillUpdate(nextProps) {
    if (
      this.props.match.params.bc_weekly_num !==
      nextProps.match.params.bc_weekly_num
    ) {
      const idx = this.getActiveCollectionIdx(nextProps.match.params.bc_weekly_num);
      this.props.switchToCollection(idx, nextProps.collections);
    }
  }

  getActiveCollectionIdx(
    bc_weekly_num = this.props.match.params.bc_weekly_num,
    collections = this.props.collections
  ) {
    const yo = this.props.getActiveCollectionIdx(bc_weekly_num, collections);
    return yo;
  }

  autoSwitchCollections(collectionIdx, collections) {
    this.props.history.push(`/weekly-${collections[collectionIdx].collection_num}`);
  }

  playOnLoadCollectionIfNeeded(collection_num) {
    if (
      !this.preselectedCollectionPlayed &&
      this.preselectedCollectionWeekNum === collection_num
    ) {
      this.preselectedCollectionPlayed = true;
      this.props.switchToCollection(
        this.preselectedCollectionIdx,
        this.props.collections
      );
    }
  }

  playTrack(track, collection) {
    this.props.burnCartelPlayer.playTrack(
      track,
      collection,
      this.props.collections,
      this.props.setPlaying
    );
  }

  scrollToCollectionOnImagesLoad() {
    if (this.state.collectionImagesLoaded === this.props.collections.length) {
      this.props.scrollToCollection(this.getActiveCollectionIdx());
    }
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
          togglePlay={this.props.togglePlay}
        />
        {this.props.loading.collections ? (
          <BCLoading />
        ) : (
          <div className="BCWeekly-content-container">
            <Wrapper>
              <Responsive minWidth={950}>
                <BCSpotlightItem
                  collection={
                    this.props.collections[this.getActiveCollectionIdx()]
                  }
                  playing={this.props.playing}
                  trackLoading={this.props.trackLoading}
                  width={450}
                  track={track}
                  playTrack={(track, collection) => {
                    this.playTrack(track, collection);
                  }}
                />
              </Responsive>
              <BCWeeklyList
                handleModalOpen={this.props.handleModalOpen}
                collections={this.props.collections}
                playing={this.props.playing}
                activeTrack={track}
                activeCollectionIdx={this.getActiveCollectionIdx()}
                loadingCollectionTracks={this.props.loading.collectionTracks}
                playTrack={(track, collection) => {
                  this.playTrack(track, collection);
                }}
                turnOffCanSwitchCollection={this.props.turnOffCanSwitchCollection}
                incrementCollectionImagesLoaded={() =>
                  this.setState(
                    {
                      collectionImagesLoaded:
                        this.state.collectionImagesLoaded + 1
                    },
                    () => {
                      // console.log(`${this.state.collectionImagesLoaded} / ${this.props.collections.length} done`);
                      this.scrollToCollectionOnImagesLoad();
                    }
                  )
                }
                canShowTracklist={this.props.canShowTracklist}
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
