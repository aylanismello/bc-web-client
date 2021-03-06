import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import Responsive from 'react-responsive';
import SplashBanner from '../SplashBanner';
import { getWeeklyItemTexts } from '../../helpers';
import PaginationButton from './PaginationButton';
import CollectionList from '../CollectionList';
import CollectionDetail from '../CollectionDetail';
import CollectionTabs from './CollectionTabs';
import BCLoading from '../BCLoading';
import { ContentWrapper } from '../MarakuyaComponents';
import { baseUrl } from '../../config';
import './BCHome.scss';

const queryString = require('query-string');
const BCHomeMainContent = styled.div`
  display: ${props => (props.show ? 'grid' : 'none')};
  margin-top: 3rem;
  grid-template-columns: minmax(30%, 200px) auto;
  grid-gap: 3rem;

  @media (max-width: 1150px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;
  }
`;

const BCHomeCollectionInfo = styled.div`
  font-size: 14px;
  color: #dcdcdc;
`;

const BCHomeCollectionDescription = styled.div`
  line-height: 1.5;
  width: 100%;
  max-width: 250px;
  margin-top: 2rem;
  font-family: "sofia-pro", sans-serif;
  @media (max-width: 1150px) {
    width: auto;
    max-width: inherit;
  }
`;

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
    this.STARTING_SIZE = this.props.isMobile ? 2 : 5;
    this.state = Object.freeze({
      isFromEmail: false,
      collectionImagesLoaded: 0,
      collectionTypeSelected: 0,
      page: {
        curated: this.STARTING_SIZE,
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

    if (!showList) style = { ...style, display: 'none' };

    const showPagination = this.state.page[type] < collections.length;
    // WHERE THE PAGINATION HAPPENENS
    
    const paginatedCollections = collections.slice(0, this.state.page[type]);

    const headerText = getWeeklyItemTexts({ collection_type: type })[1];

    return (
      <div className="BCHome-collection-container" style={style}>
        {/* <div className="BCHome-collection-header"> {headerText} </div> */}
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
          <PaginationButton
            paginate={() => {
              this.paginate(type, showPagination);
              window.logEvent('PAGINATION', { type });
            }}
            show={showPagination}
          />
        </div>
      </div>
    );
  }

  renderCollection(showList) {
    const { collections } = this.props;
    const { collectionTypeSelected } = this.state
    const curatedCollections = collections.filter(c => c.collection_type === 0);
    const risingCollections = collections.filter(c => c.collection_type === 1);
    const curatorCollections = collections.filter(c => c.collection_type === 2);

    if (collectionTypeSelected === 0) {
      return this.makeCollectionList(curatedCollections, showList, 'curated');
    } else if(collectionTypeSelected === 1){
      return this.makeCollectionList(risingCollections, showList, 'rising');
    } else {
      return this.makeCollectionList(curatorCollections, showList, 'curators');
    }
  }

  render() {
    const {
      pageReadyForFakeModal,
      contentWidthShrunk,
      isMobile,
      contentWidth,
      collections,
      setEpisodeTrack
    } = this.props;

    const { collectionTypeSelected } = this.state;
    const showList = !isMobile || (isMobile && !pageReadyForFakeModal);

    const [topText, headerText, description] = getWeeklyItemTexts({
      collection_type: collectionTypeSelected
    });

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
            <ContentWrapper isMainContent>
              <Responsive maxDeviceWidth={767}>
                <CollectionDetail
                  guests={this.props.guests}
                  setEpisodeTrack={setEpisodeTrack}
                  show={pageReadyForFakeModal}
                  playingCollection={this.props.playingCollection}
                  togglePlay={() => this.props.togglePlay(true)}
                  collectionNum={this.props.collectionNum}
                  trackLoading={this.props.trackLoadingInCollectionDetail}
                  openModal={this.props.openModal}
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
              <CollectionTabs
                show={showList}
                collectionTypeSelected={this.state.collectionTypeSelected}
                setNewFeatureClicked={() => this.props.setNewFeatureClicked()}
                newFeatureClicked={this.props.newFeatureClicked}
                selectCollectionType={idx => {
                  window.logEvent('SELECT_COLLECTION_TYPE', {
                    collectionIdx: idx
                  });
                  this.setState({ collectionTypeSelected: idx });
                }}
              />
              <BCHomeMainContent className="BCHomeMainContent" show={showList}>
                <BCHomeCollectionInfo>
                  <div className="BCHome-collection-header"> {headerText} </div>
                  <BCHomeCollectionDescription className="BCHomeCollectionDescription">
                    {description}
                  </BCHomeCollectionDescription>
                </BCHomeCollectionInfo>
                {this.renderCollection(showList)}
              </BCHomeMainContent>
            </ContentWrapper>
          </div>
        )}
      </div>
    );
  }
}
// https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(BCHome);
