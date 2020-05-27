import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Responsive from 'react-responsive';
import axios from 'axios';
import createHashHistory from 'history/createHashHistory';
// import ReactGA from 'react-ga';
import withSizes from 'react-sizes';
import * as Sentry from '@sentry/browser';

import { baseUrl } from '../../config';
import BurnCartelPlayer from '../../BurnCartelPlayer';
import SideMenu from '../SideMenu';
import TopNav from '../TopNav';
import CollectionDetail from '../CollectionDetail';
import BCModal from '../BCModal';
import BCHome from '../BCHome';
import BottomNav from '../BottomNav';
import Footer from '../Footer';
import './App.scss';

const history = createHashHistory();
const isProd = process.env.NODE_ENV === 'production';

window.logEvent = (name, body = {}) => {
  if (isProd) {
    window.amplitude.getInstance().logEvent(name, body);
  }
};

const initProdServices = () => {
  // medium.com/alturasoluciones/how-to-set-up-and-use-google-analytics-in-react-apps-fb057d195d13
  // (fuck) GOOGLE ANALYTICS
  // console.log('initializing prod services');
  // ReactGA.initialize('UA-84947411-1');
  const landingPath = window.location.hash.replace('#', '');
  // ReactGA.pageview(landingPath);

  window.logEvent('LANDED', { landingPath });
  // history.listen(location => {
  //   ReactGA.pageview(location.pathname);
  // });

  // SENTRY BUG TRACKING
  Sentry.init({
    dsn: 'https://26268e6a955e474095d156b1cc6069ab@sentry.io/1384208'
  });
};

if (isProd) initProdServices();

class App extends Component {
  static isValidUrlParam(param) {
    return /^weekly-[0-9]+$/.test(param);
  }

  static weekHasBeenReleased(collections, bc_weekly_num) {
    const weekNum = parseInt(bc_weekly_num.split('-')[1], 10);
    return App.collectionAsHash(collections)[weekNum];
  }

  static collectionAsHash(arrCollections) {
    const collections = {};
    arrCollections.forEach((collection, idx) => {
      collections[collection.collection_num] = { ...collection, idx };
    });
    return collections;
  }

  constructor(props) {
    super(props);
    this.setInitialCollections = this.setInitialCollections.bind(this);
    this.toggleFromCollectionDetail = this.toggleFromCollectionDetail.bind(this);
    this.handleOpenWhyTrackChosenModal = this.handleOpenWhyTrackChosenModal.bind(this);
    this.playingCollection = this.playingCollection.bind(this);
    this.burnCartelPlayer = new BurnCartelPlayer(
      track => this.setTrack(track),
      play => this.setPlaying(play),
      loading => this.setLoading('track', loading),
      error => this.setError(error),
      currentTime => this.setCurrentTime(currentTime),
      playingCollectionNum =>
        this.setPlayingCollectionNum(playingCollectionNum),
      (currentTime, notCheckingForNextTrack) =>
        this.setEpisodeTrack(currentTime, notCheckingForNextTrack)
    );
  }

  componentWillMount() {
    if (window.localStorage.getItem('newFeatureClicked')) {
      this.setState({ newFeatureClicked: true });
    }
    this.setState({ isMobile: this.isMobile() });
  }

  componentDidMount() {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/transitionend_event
    document
      .getElementById('page-wrap')
      .addEventListener('transitionend', () => {
        if (this.state.sideMenuOpen) {
          this.setState({ contentWidthShrunk: true });
        }
      });
  }

  state = Object.freeze({
    track: {},
    collections: [],
    currentTime: {
      raw: 0,
      before: '',
      after: ''
    },
    guests: {},
    newFeatureClicked: false,
    openCollection: {
      idx: 0,
      num: null
    },
    modalTrackId: null,
    sideMenuOpen: false,
    contentWidthShrunk: false,
    playingCollectionNum: null,
    playerOpen: true,
    initialCollectionIdx: 0,
    playButtonHasBeenPressed: false,
    playing: false,
    repeat: false,
    pageReadyForFakeModal: false,
    isMobile: undefined,
    visualize: false,
    modalOpen: false,
    modalEpisode: undefined,
    modalDJ: undefined,
    // didCopy: false,
    collectionNum: null,
    copiedEpisodeNum: null,
    showTracklist: false,
    loading: {
      collections: true,
      track: false,
      // set to false initally because the API sends you back your first tracks in the /collections endpoint!
      collectionTracks: false
    },
    errors: []
  });

  componentWillMount() {
    document.addEventListener("keydown", (e) => this.handleSpaceKey(e));
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => this.handleSpaceKey(e));
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors.length !== nextState.errors.length) {
      this.logNewError(nextState.errors.reverse()[0]);
    }

    if (
      isProd &&
      !this.state.playButtonHasBeenPressed &&
      nextState.playButtonHasBeenPressed
    ) {
      window.logEvent('PLAY_BTN_HAS_BEEN_PRESSED');
    }

    if (
      isProd &&
      this.state.loading.collections &&
      !nextState.loading.collections
    ) {
      window.logEvent('INIT_PAGE_COLLECTIONS_LOADED');
    }

    // FOLLOW TRACK AROUND AS EPISODE OR PLAYLIST PROGRESSES
    if (
      this.state.track.id !== nextState.track.id &&
      nextState.track.track_number !== 0
    ) {
      const cannotScrollToFirstTrack =
        !this.state.isMobile &&
        this.state.track.track_number === 0 &&
        nextState.track.track_number === 1;

      if (cannotScrollToFirstTrack) {
        return;
      }
      this.scrollToTrack(nextState.track.id);
    }
  }

  logNewError(newError) {
    if (isProd) Sentry.captureMessage(newError);

    toast(newError, {
      position: 'top-right',
      autoClose: 10000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false
    });
  }

  getActiveCollection(bc_weekly_num, collections = this.props.collections) {
    let activeCollection = collections[0] || {};

    if (App.isValidUrlParam(bc_weekly_num)) {
      const collectionFromWeekNum = App.weekHasBeenReleased(
        collections,
        bc_weekly_num
      );
      if (collectionFromWeekNum) {
        activeCollection = collectionFromWeekNum;
      }
    }

    return activeCollection;
  }

  handleSpaceKey(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
      this.togglePlay();
    }
  }

  setInitialCollections(
    collections,
    isPreselectedCollection,
    initialCollectionIdx,
    collectionNum
  ) {
    this.setState({ collections }, () => {
      if (isPreselectedCollection && this.state.isMobile) {
        this.setState({
          initialCollectionIdx,
          openCollection: { idx: initialCollectionIdx, num: collectionNum },
          pageReadyForFakeModal: true
        });
      } else if (isPreselectedCollection) {
        this.setState({
          initialCollectionIdx,
          openCollection: { idx: initialCollectionIdx, num: collectionNum },
          sideMenuOpen: true
        });
      } else {
        this.setState({
          initialCollectionIdx,
          openCollection: { idx: initialCollectionIdx, num: collectionNum }
        });
      }
    });
    const collection = collections[initialCollectionIdx];

    this.fetchGuests(collection.tracks, collection);
  }

  setCurrentTime(currentTime) {
    this.setState({ currentTime });
  }

  setTrack(track) {
    this.setState({ track, playButtonHasBeenPressed: true }, () => {
      const formattedTitle = `${track.name} by ${track.artist_name} | Curated by Burn Cartel`;
      document.title = formattedTitle;
      this.updateTrackPlay(track.id);
    });
  }

  getTrackFromTimeCode(timeCode) {
    // grab all collection tracks.
    const currentTracklist = this.burnCartelPlayer.collection.tracks;

    for (let idx = 1; idx < currentTracklist.length; idx++) {
      const currentTrack = currentTracklist[idx];
      const nextTrack = currentTracklist[idx + 1];
      // we want teh FIRST instance of the currentTimeCode being greating than or equal to any track's time code

      if (!nextTrack) {
        return currentTracklist[currentTracklist.length - 1];
      } else if (
        timeCode >= currentTrack.time_code &&
        timeCode <= nextTrack.time_code
      ) {
        return currentTrack;
      }
    }

    // something went wrong, just go to first track.
    return currentTracklist[1];
  }
  // accepts a track, or a time_code from seek bar
  setEpisodeTrack(trackOrTimeCode, notCheckingForNextTrack = true) {
    if (!this.hasMix()) return;

    let track;

    if (trackOrTimeCode.id) {
      track = trackOrTimeCode;
      this.playEpisodeFromTracklist(track);
    } else {
      track = this.getTrackFromTimeCode(trackOrTimeCode);

      if (notCheckingForNextTrack) {
        window.sc.setTime(trackOrTimeCode);
      }

      if (track.id !== this.state.track.id) {
        this.setState({ track });
      }
    }
  }

  playEpisodeFromTracklist(track) {
    const openCollection = this.getOpenCollection();

    if (
      openCollection &&
      this.state.openCollection.num !== this.state.playingCollectionNum
    ) {
      // always just play the episode
      this.playTrack(openCollection.tracks[0], openCollection);
      window.forceGoToEpisodeTrack = () => {
        // this.setState({ track });
        console.log('force seeking to track!');
        window.sc.setTime(track.time_code + 1);
      };
      window.forceSeekAfterEpisodeLoad = true;
    } else {
      //  track = trackOrTimeCode;
      this.setState({ track });
      window.sc.setTime(track.time_code);
    }
  }

  updateTrackPlay(id) {
    axios
      .post(`${baseUrl}/tracks/play`, { id })
      .then(results => {
        // this.setState({ loadingUpdatePlayCount: false });
      })
      .catch(error => {
        this.setError(error.message);
      });
  }

  setPlayingCollectionNum(playingCollectionNum) {
    this.setState({ playingCollectionNum }, () => {
      if (this.playingCollectionHasMix()) {
        window.isPlayingCuratedCollection = true;
      } else {
        window.isPlayingCuratedCollection = false;
      }
    });
  }

  setError(error) {
    // implement react toaster or a notification system to handle this
    const { errors } = this.state;
    const newErrors = [error, ...errors];
    this.setState({ errors: newErrors });
  }

  setPlaying(playing) {
    this.setState({ playing, playerOpen: true });
  }

  setLoading(resource, state) {
    if (!Object.keys(this.state.loading).includes(resource)) {
      throw Error(`Cannot set loading state to a non-existent resouce of: ${resource}!`);
    }

    const newResouceLoadingState = {};
    newResouceLoadingState[resource] = state;
    const newLoading = { ...this.state.loading, ...newResouceLoadingState };

    this.setState({
      loading: newLoading
    });
  }

  switchCollectionMobile(
    collectionNum,
    collectionIdx,
    collections,
    playOnLoad
  ) {
    const currentCollection = collections[collectionIdx];

    if (!currentCollection.tracks) {
      // add loading icon to track item
      this.fetchCollectionTracks(collectionIdx, collections, playOnLoad);
    } else if (collectionNum) {
      this.setState({ pageReadyForFakeModal: true });
      window.scrollTo(0, 0);
      if (playOnLoad) {
        this.burnCartelPlayer.playCollection(currentCollection, collections);
      }
    }
  }

  forceReopenCollectionDetail() {
    if (this.state.isMobile) {
      this.setState({ pageReadyForFakeModal: true }, () => {
        // have to wait to possibly load
        // bug where this doesn't work on first click on mobile
        // since we're not force reopening - we're actually switching collections
        this.scrollToTrack();
      });
    } else {
      this.setState({ sideMenuOpen: true }, () => {
        this.scrollToTrack();
      });
    }
  }

  scrollSideMenu() {
    const sideMenu = document.getElementsByClassName('bm-item-list')[0];
    // TODO: need to scroll up just a bit more
    if (sideMenu) sideMenu.scrollIntoView();
  }

  switchCollectionDesktop(collectionNum, collectionIdx, collections) {
    const currentCollection = collections[collectionIdx];

    this.setState({ sideMenuOpen: true }, () => {
      this.scrollSideMenu();
    });

    if (currentCollection && !currentCollection.tracks) {
      this.fetchCollectionTracks(collectionIdx, collections, true);
    } else if (collectionNum) {
      this.burnCartelPlayer.playCollection(currentCollection, collections);
    }
  }

  isMobile() {
    return window.screen.width < 768;
  }

  // this is called on url change from BCHome
  switchToCollection(collectionIdx, collections, playOnLoad = false) {
    const currentCollection = collections[collectionIdx];

    const collectionNum = currentCollection && currentCollection.collection_num;

    if (!currentCollection) {
      return;
    } else {
      this.setState({
        openCollection: { idx: collectionIdx, num: collectionNum }
      });
    }

    if (this.state.isMobile) {
      this.switchCollectionMobile(
        collectionNum,
        collectionIdx,
        collections,
        playOnLoad
      );
    } else {
      this.switchCollectionDesktop(collectionNum, collectionIdx, collections);
      this.setState({
        playButtonHasBeenPressed: true
      });
    }
  }

  // assings to modalTrack
  fetchTrack(id) {
    this.setState({ modalTrackId: id });
  }

  fetchGuests(tracks, collection) {
    // only get guests if we are dealing with curated collections
    if (collection.collection_type !== 0) return;

    const uniqDJs = new Set(tracks.map(track => track.dj_id));

    uniqDJs.forEach(djID => {
      if (this.state.guests[djID]) {
        console.log(`already fetched ${djID}`);
        return;
      }

      console.log(`fetching ${djID}`);
      axios
        .get(`${baseUrl}/soundcloud_users/${djID}`)
        .then(({ data }) => {
          const { soundcloud_user } = data.data;
          const newGuest = {};
          newGuest[soundcloud_user.id] = soundcloud_user;
          this.setState({
            guests: {
              ...this.state.guests,
              ...newGuest
            }
          });
        })
        .catch(error => {
          this.setError(error.message);
        });
    });
  }

  fetchCollectionTracks(collectionIdx, collections, playOnLoad) {
    this.setLoading('collectionTracks', true);

    const collection = collections[collectionIdx];
    axios
      .get(`${baseUrl}/collections/${collection.id}/tracks`)
      .then(({ data }) => {
        const { tracks } = data.data.collection;

        const newCollection = {
          ...this.state.collections[collectionIdx],
          tracks
        };

        if (playOnLoad) {
          this.burnCartelPlayer.playCollection(newCollection, collections);
        }

        const oldCollections = this.state.collections;
        this.setState(
          {
            collections: [
              ...oldCollections.slice(0, collectionIdx),
              newCollection,
              ...oldCollections.slice(collectionIdx + 1, oldCollections.length)
            ]
          },
          () => {
            this.setLoading('collectionTracks', false);
            if (this.state.isMobile) {
              this.setState({ pageReadyForFakeModal: true });
              window.scrollTo(0, 0);
            }

            this.fetchGuests(tracks, collection);
          }
        );
      })
      .catch(error => {
        this.setError(error.message);
        this.setLoading('collectionTracks', false);
      });
  }

  scrollToTrack(id = this.state.track.id) {
    // const sideBar = document.getElementsByClassName('bm-menu')[0];
    const tappedTrack = document.getElementById(id);

    // if ((sideBar || this.state.isMobile) && tappedTrack) {
    if (tappedTrack) {
      tappedTrack.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // THIS ONLY HAPPENS ON THE HOME PAGE WHEN CLOSING A COLLECTION TO REMEMBER WHERE THE USER
  // WAS.

  // IT WILL BE THE SAME LOGIC FOR TRACKS
  scrollToCollection() {
    const { tappedCollectionID } = window;
    const tappedElement = document.getElementById(tappedCollectionID);

    if (tappedElement) {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      tappedElement.scrollIntoView();
      window.scrollBy(0, -(viewportHeight / 10));
    } else {
      window.scrollTo(0, 0);
    }
  }

  togglePlayDesktop() {
    if (!this.state.playButtonHasBeenPressed) {
      this.switchToCollection(
        this.state.initialCollectionIdx,
        this.state.collections
      );
    } else {
      this.setState({ playing: !this.state.playing }, () => {
        if (this.state.playing) {
          this.burnCartelPlayer.resume();
        } else {
          this.burnCartelPlayer.pause();
        }
      });
    }
  }

  togglePlayMobile(
    isTogglingFromPlayingCollection,
    isTogglingFromCollectionDetail
  ) {
    // Playlist detail is open
    if (
      !this.state.playButtonHasBeenPressed &&
      !this.state.pageReadyForFakeModal &&
      !isTogglingFromCollectionDetail
    ) {
      this.switchToCollection(
        this.state.initialCollectionIdx,
        this.state.collections,
        true
      );
    } else if (
      !this.state.playButtonHasBeenPressed &&
      this.state.pageReadyForFakeModal
    ) {
      this.burnCartelPlayer.playCollection(
        this.state.collections[this.state.openCollection.idx],
        this.state.collections
      );
      // Playlist detail is closed
    } else if (
      !this.state.playButtonHasBeenPressed &&
      !this.state.pageReadyForFakeModal
    ) {
      // should we autoplay this?
      this.switchToCollection(
        this.state.initialCollectionIdx,
        this.state.collections
      );
    } else if (!this.state.pageReadyForFakeModal) {
      // CASE WHERE WE JUST WANT TO PAUSE / PLAY GLOBALLY
      this.setState({ playing: !this.state.playing }, () => {
        if (this.state.playing) {
          this.burnCartelPlayer.resume();
        } else {
          this.burnCartelPlayer.pause();
        }
      });
    } else if (isTogglingFromPlayingCollection) {
      this.setState({ playing: !this.state.playing }, () => {
        if (this.state.playing) {
          this.burnCartelPlayer.resume();
        } else {
          this.burnCartelPlayer.pause();
        }
      });
      // WE WANT TO PLAY OR PAUSE THE CURRENT COLLECTION OPENED
    } else if (
      !isTogglingFromPlayingCollection &&
      this.state.pageReadyForFakeModal &&
      isTogglingFromCollectionDetail
    ) {
      this.burnCartelPlayer.playCollection(
        this.state.collections[this.state.openCollection.idx],
        this.state.collections
      );
    } else {
      this.setState({ playing: !this.state.playing }, () => {
        if (this.state.playing) {
          this.burnCartelPlayer.resume();
        } else {
          this.burnCartelPlayer.pause();
        }
      });
    }
  }

  togglePlay(isTogglingFromPlayingCollection, isTogglingFromCollectionDetail) {
    if (this.state.isMobile) {
      this.togglePlayMobile(
        isTogglingFromPlayingCollection,
        isTogglingFromCollectionDetail
      );
    } else {
      this.togglePlayDesktop();
    }
  }

  hasMix() {
    const openCollection = this.state.collections[
      this.state.openCollection.idx
    ];
    return openCollection && openCollection.collection_type === 0;
  }

  playingCollectionHasMix() {
    const { collections, playingCollectionNum } = this.state;

    const playingCollection =
      collections &&
      collections.filter(collection => collection.collection_num === playingCollectionNum)[0];

    return playingCollection && playingCollection.collection_type === 0;
  }

  toggleRepeat() {
    this.setState({ repeat: !this.state.repeat }, () => {
      if (this.state.repeat) {
        this.burnCartelPlayer.setRepeat(true);
      } else {
        this.burnCartelPlayer.setRepeat(false);
      }
    });
  }

  playTrack(track, collection) {
    this.burnCartelPlayer.playTrack(
      track,
      collection,
      this.state.collections,
      this.state.setPlaying
    );
  }

  getOpenCollection() {
    return this.state.collections[this.state.openCollection.idx];
  }

  toggleVisualize() {
    this.setState({ visualize: !this.state.visualize });
  }

  getCurrentTrack() {
    let currentTrack = this.state.track;

    const { initialCollectionIdx, collections } = this.state;
    if (
      !this.state.playButtonHasBeenPressed &&
      collections[initialCollectionIdx] &&
      collections[initialCollectionIdx].tracks
    ) {
      currentTrack = collections[initialCollectionIdx].tracks[0];
    }
    return currentTrack;
  }

  playingCollection() {
    return (
      this.state.playing &&
      this.state.openCollection.num === this.state.playingCollectionNum
    );
  }

  toggleFromCollectionDetail() {
    this.togglePlay(
      this.state.openCollection.num === this.state.playingCollectionNum,
      true
    );
  }

  handleOpenWhyTrackChosenModal(dj, episodeNum, trackId) {
    // in the event that this is from rising or elsewhere, we'll have to hit the API.
    // and write that endpoint.
    this.setState({
      modalOpen: true,
      modalDJ: undefined,
      modalEpisode: undefined
    });
    
    if (dj) {
      this.setState({
        modalDJ: dj,
        modalEpisode: episodeNum
      });
    } else {
      // debugger;
      
      this.setState({
        modalOpen: true
      });
      this.fetchTrack(trackId);
    }
  }

  render() {
    const { graphqlCollections } = this.props;
    // console.log('GRAPHQL: ');
    // console.log(graphqlCollections);
    // console.log('REST: ');
    // console.log(this.state.collections);
    const track = this.getCurrentTrack();
    // TODO:
    // what's the diff between current track and this.state.track?
    const { playerOpen, playing, guests } = this.state;
    // const { menuShouldBeFixed } = this.props;
    // const menuShouldBeFixed = true;
    // const menuWidth = menuShouldBeFixed ? '320px' : '30%';
    // const contentWidth = menuShouldBeFixed ? 'auto' : '70%';
    const menuWidthRaw = 350;
    const menuWidth = `${menuWidthRaw}px`;
    const contentWidth = `${this.props.currentWidth - menuWidthRaw}px`;

    return (
      <Router history={history}>
        <div
          className={`App ${this.state.playerOpen ? 'shift-up' : ''}`}
          id="outer-container"
        >
          <BCModal
            modalOpen={this.state.modalOpen}
            episode={this.state.modalEpisode}
            dj={this.state.modalDJ}
            trackId={this.state.modalTrackId}
            closeModal={() => this.setState({ modalOpen: false })}
          />
          <Responsive minDeviceWidth={768}>
            <SideMenu
              sideMenuOpen={this.state.sideMenuOpen}
              menuWidth={menuWidth}
              loading={this.state.loading.collections}
            >
              <CollectionDetail
                show
                isSideMenu
                guests={guests}
                setEpisodeTrack={episodeTrack =>
                  this.setEpisodeTrack(episodeTrack)
                }
                openModal={this.handleOpenWhyTrackChosenModal}
                playingCollection={this.playingCollection()}
                togglePlay={this.toggleFromCollectionDetail}
                collectionNum={this.state.openCollection.num}
                trackLoading={this.state.loading.track}
                closeModal={() =>
                  this.setState({
                    sideMenuOpen: false,
                    contentWidthShrunk: false
                  })
                }
                collection={
                  this.state.collections[this.state.openCollection.idx]
                }
                idx={this.state.openCollection.idx}
                activeTrack={this.state.track}
                loadingCollectionTracks={this.state.loading.collectionTracks}
                playTrack={(track, collection) =>
                  this.playTrack(track, collection)
                }
              />
            </SideMenu>
          </Responsive>
          <div id="page-wrap">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
            {this.state.pageReadyForFakeModal ||
            this.state.sideMenuOpen ? null : (
              <TopNav
                isMobile={this.state.isMobile}
                forceReopenCollectionDetail={() =>
                  this.forceReopenCollectionDetail()
                }
              />
            )}
            <Route
              exact
              path="/"
              render={() => <Redirect push to="/weekly" />}
            />
            <Route
              exact
              path="/:bc_weekly_num"
              render={() => (
                <BCHome
                  setEpisodeTrack={episodeTrack =>
                    this.setEpisodeTrack(episodeTrack)
                  }
                  guests={guests}
                  playButtonHasBeenPressed={this.state.playButtonHasBeenPressed}
                  contentWidthShrunk={this.state.contentWidthShrunk}
                  playingCollectionNum={this.state.playingCollectionNum}
                  newFeatureClicked={this.state.newFeatureClicked}
                  setNewFeatureClicked={() => {
                    if (!this.state.newFeatureClicked) {
                      this.setState({ newFeatureClicked: true }, () => {
                        window.localStorage.setItem('newFeatureClicked', true);
                      });
                    }
                  }}
                  contentWidth={contentWidth}
                  isMobile={this.state.isMobile}
                  pageReadyForFakeModal={this.state.pageReadyForFakeModal}
                  handleModalOpen={episodeNum => {
                    this.setState({
                      copiedEpisodeNum: episodeNum,
                      modalOpen: true
                    });
                  }}
                  getActiveCollection={(x, y) => this.getActiveCollection(x, y)}
                  forceReopenCollectionDetail={() =>
                    this.forceReopenCollectionDetail()
                  }
                  collection={
                    this.state.collections[this.state.openCollection.idx]
                  }
                  idx={this.state.openCollection.idx}
                  loading={this.state.loading}
                  closeModal={() => {
                    this.setState(
                      {
                        pageReadyForFakeModal: false
                      },
                      () => {
                        this.scrollToCollection();
                      }
                    );
                  }}
                  collectionNum={this.state.openCollection.num}
                  setInitialCollections={this.setInitialCollections}
                  track={track}
                  switchToCollection={(
                    collectionIdx,
                    collections,
                    playOnLoad
                  ) =>
                    this.switchToCollection(
                      collectionIdx,
                      collections,
                      playOnLoad
                    )
                  }
                  activeTrack={this.state.track}
                  showTracklist={this.state.showTracklist}
                  setError={error => this.setError(error)}
                  scrollToCollection={idx => this.scrollToCollection(idx)}
                  playTrack={(playingTrack, collection) =>
                    this.playTrack(playingTrack, collection)
                  }
                  openModal={this.handleOpenWhyTrackChosenModal}
                  burnCartelPlayer={this.burnCartelPlayer}
                  playing={this.state.playing}
                  playingCollection={this.playingCollection()}
                  loadingCollectionTracks={this.state.loading.collectionTracks}
                  togglePlay={this.toggleFromCollectionDetail}
                  playerOpen={this.state.playerOpen}
                  collections={this.state.collections}
                  trackLoading={this.state.loading.track}
                  trackLoadingInCollectionDetail={
                    this.state.loading.track &&
                    this.state.openCollection.num ===
                      this.state.playingCollectionNum
                  }
                  setLoading={(resource, state) =>
                    this.setLoading(resource, state)
                  }
                />
              )}
            />
            {this.state.pageReadyForFakeModal ||
            this.state.loading.collections ? null : (
              <Footer
                loadingCollections={this.state.loading.collections}
                width={this.state.contentWidthShrunk ? '70%' : ''}
              />
            )}
          </div>
          {playerOpen && (
            <BottomNav
              track={track}
              hasMix={this.hasMix()}
              setEpisodeTrack={timeCode => this.setEpisodeTrack(timeCode)}
              playing={playing}
              defaultCollectionNum={this.state.openCollection.num}
              forceReopenCollectionDetail={() =>
                this.forceReopenCollectionDetail()
              }
              playerOpen={this.state.playerOpen}
              currentTime={this.state.currentTime}
              trackLoading={this.state.loading.track}
              togglePlay={() => {
                this.togglePlay();
              }}
              playingCollectionNum={this.state.playingCollectionNum}
              goToTrack={whichOne => this.burnCartelPlayer.goToTrack(whichOne)}
              toggleRepeat={() => this.toggleRepeat()}
              repeat={this.state.repeat}
              visualize={this.state.visualize}
              toggleVisualize={() => this.toggleVisualize()}
            />
          )}
        </div>
      </Router>
    );
  }
}

const mapSizesToProps = ({ width }) => ({
  currentWidth: width
});

export default withSizes(mapSizesToProps)(App);
