import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import Responsive from 'react-responsive';
import SplashBanner from '../SplashBanner';
import BCWeeklyList from '../BCWeeklyList';
import CollectionDetail from '../CollectionDetail';
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
    this.props.burnCartelPlayer.autoSwitchCollections = (
      collectionIdx,
      collections,
      playOnLoad
    ) => this.autoSwitchCollections(collectionIdx, collections, playOnLoad);

    this.preselectedCollectionPlayed = false;
    this.count = 0;
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

        this.props.setInitialCollections(
          collections,
          isPreselectedCollection,
          this.preselectedCollectionIdx,
          collection_num
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
      const { bc_weekly_num } = nextProps.match.params;
      const idx = this.getActiveCollectionIdx(bc_weekly_num);
      this.props.switchToCollection(idx, nextProps.collections);
    }
  }

  getActiveCollectionIdx(
    bc_weekly_num = this.props.match.params.bc_weekly_num,
    collections = this.props.collections
  ) {
    return this.props.getActiveCollectionIdx(bc_weekly_num, collections);
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

  scrollToCollectionOnImagesLoad() {
    if (this.state.collectionImagesLoaded === this.props.collections.length) {
      this.props.scrollToCollection(this.getActiveCollectionIdx());
    }
  }

  updateActiveCollection(collection_num) {
    if (!this.props.loading.collectionTracks) {
      this.props.handleModalOpen(collection_num);
      this.playOnLoadCollectionIfNeeded(collection_num);
      this.props.history.push(`/weekly-${collection_num}`);
    }
  }

  render() {
    const { track, pageReadyForFakeModal } = this.props;

    return (
      <div className="BCWeekly">
        {pageReadyForFakeModal ? null : (
          <SplashBanner
            isFromEmail={this.state.isFromEmail}
            loading={this.props.loading}
            playing={this.props.playing}
            playerOpen={this.props.playerOpen}
            togglePlay={this.props.togglePlay}
          />
        )}
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
                  playTrack={this.props.playTrack}
                />
              </Responsive>
              {pageReadyForFakeModal ? (
                <CollectionDetail
                  collectionNum={this.props.collectionNum}
                  closeModal={this.props.closeModal}
                  collection={this.props.collection}
                  idx={this.props.idx}
                  activeTrack={this.props.activeTrack}
                  loadingCollectionTracks={this.props.loadingCollectionTracks}
                  playTrack={(track, collection) =>
                    this.props.playTrack(track, collection)
                  }
                />
              ) : (
                <BCWeeklyList
                  handleModalOpen={this.props.handleModalOpen}
                  collections={this.props.collections}
                  playing={this.props.playing}
                  activeTrack={track}
                  activeCollectionIdx={this.getActiveCollectionIdx()}
                  loadingCollectionTracks={this.props.loading.collectionTracks}
                  playTrack={this.props.playTrack}
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
                  showTracklist={this.props.showTracklist}
                  updateActiveCollection={collection_num =>
                    this.updateActiveCollection(collection_num)
                  }
                />
              )}
            </Wrapper>
          </div>
        )}
      </div>
    );
  }
}
// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(BCWeekly);
