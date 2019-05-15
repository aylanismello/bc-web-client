import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import Responsive from 'react-responsive';
import SplashBanner from '../SplashBanner';
import { getWeeklyItemTexts } from '../../helpers';
import PaginationButton from './PaginationButton';
import CollectionList from '../CollectionList';
import CollectionDetail from '../CollectionDetail';
import BCLoading from '../BCLoading';
import Wrapper from '../Wrapper';
import { baseUrl } from '../../config';
import './BCHome.scss';

const queryString = require('query-string');
// const STARTING_SIZE = 4;
// const PAGINATION_SIZE = STARTING_SIZE;

// check out our contentz
// https://console.aws.amazon.com/s3/buckets/burn-cartel-content/?region=us-west-2&tab=overview
class BCHome extends React.Component {
  constructor(props) {
    super(props);
    this.props.burnCartelPlayer.autoSwitchCollections = (
      collectionIdx,
      collections,
      playOnLoad
    ) => this.autoSwitchCollections(collectionIdx, collections, playOnLoad);

    this.preselectedCollectionPlayed = false;
    this.STARTING_SIZE = this.props.isMobile ? 1 : 4;
    this.state = Object.freeze({
      isFromEmail: false,
      collectionImagesLoaded: 0,
      page: {
        weekly: this.STARTING_SIZE,
        rising: this.STARTING_SIZE
      }
    });
  }

  

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
        this.preselectedCollectionIdx = this.props.getActiveCollection(
          `weekly-${collection_num}`,
          collections
        ).idx;

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
      const idx = this.getActiveCollection(bc_weekly_num).idx;
      this.props.switchToCollection(idx, nextProps.collections);
    }
  }

  getActiveCollection(
    bc_weekly_num = this.props.match.params.bc_weekly_num,
    collections = this.props.collections
  ) {
    return this.props.getActiveCollection(bc_weekly_num, collections);
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

  updateActiveCollection(collection_num) {
    if (!this.props.loadingCollectionTracks) {
      this.playOnLoadCollectionIfNeeded(collection_num);
      const newUrl = `/weekly-${collection_num}`;

      if (window.location.hash && window.location.hash.includes(newUrl)) {
        this.props.forceReopenCollectionDetail();
      } else {
        this.props.history.push(newUrl);
      }
    }
  }

  paginate(type, showPagination) {
    const newPage = {};
    if (showPagination) {
      newPage[type] = 100;
    } else {
      newPage[type] = this.STARTING_SIZE;
    }
    this.setState({ page: { ...this.state.page, ...newPage } });
  }

  makeCollectionList(collections, showList, type) {
    let style = {};

    if (!showList) style = { display: 'none' };
    if (type !== 'weekly') style = { ...style, marginTop: '7rem' };

    const showPagination = this.state.page[type] < collections.length;
    const paginatedCollections = collections.slice(
      0,
      this.state.page[type]
    );

    const headerText = getWeeklyItemTexts({ collection_type: type })[1];

    return (
      <div className="BCHome-collection-container" style={style}>
        <div className="BCHome-collection-header"> {headerText} </div>
        <CollectionList
          show={showList}
          handleModalOpen={this.props.handleModalOpen}
          collections={paginatedCollections}
          playingCollectionNum={this.props.playingCollectionNum}
          playing={this.props.playing}
          activeTrack={this.props.track}
          activeCollectionId={this.getActiveCollection().id}
          loadingCollectionTracks={this.props.loadingCollectionTracks}
          loadingTrack={this.props.loading.track}
          playTrack={this.props.playTrack}
          showTracklist={this.props.showTracklist}
          updateActiveCollection={collection_num =>
            this.updateActiveCollection(collection_num)
          }
        />
        <div className="BCHome-pagination-container">
          <PaginationButton paginate={() => this.paginate(type, showPagination)} show={showPagination} />
        </div>
      </div>
    );
  }

  render() {
    const {
      pageReadyForFakeModal,
      contentWidthShrunk,
      isMobile,
      contentWidth,
      collections
    } = this.props;
    const showList = !isMobile || (isMobile && !pageReadyForFakeModal);

    const handPickedCollections = collections.filter(c => c.collection_type === 0);
    const algoPickedCollections = collections.filter(c => c.collection_type === 1);

    return (
      <div
        className="BCHome"
        style={contentWidthShrunk ? { width: contentWidth } : {}}
      >
        {!showList ? null : (
          <SplashBanner
            isFromEmail={this.state.isFromEmail}
            loading={this.props.loading}
            playButtonHasBeenPressed={this.props.playButtonHasBeenPressed}
            playing={this.props.playing}
            playerOpen={this.props.playerOpen}
            togglePlay={() => this.props.togglePlay(false)}
          />
        )}
        {this.props.loading.collections ? (
          <BCLoading />
        ) : (
          <div className="BCHome-content-container">
            <Wrapper>
              {/* <Responsive minDeviceWidth={950}>
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
              </Responsive> */}

              <Responsive maxDeviceWidth={767}>
                <CollectionDetail
                  show={pageReadyForFakeModal}
                  playingCollection={this.props.playingCollection}
                  togglePlay={() => this.props.togglePlay(true)}
                  collectionNum={this.props.collectionNum}
                  trackLoading={this.props.trackLoadingInCollectionDetail}
                  closeModal={this.props.closeModal}
                  collection={this.props.collection}
                  idx={this.props.idx}
                  activeTrack={this.props.activeTrack}
                  loadingCollectionTracks={this.props.loadingCollectionTracks}
                  playTrack={(currentTrack, collection) =>
                    this.props.playTrack(currentTrack, collection)
                  }
                />
              </Responsive>

              {this.makeCollectionList(
                handPickedCollections,
                showList,
                'weekly'
              )}
              {this.makeCollectionList(
                algoPickedCollections,
                showList,
                'rising'
              )}
            </Wrapper>
          </div>
        )}
      </div>
    );
  }
}
// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(BCHome);
