import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Responsive from 'react-responsive';
import axios from 'axios';
import createHashHistory from 'history/createHashHistory';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';

import { baseUrl } from '../../config';
import BurnCartelPlayer from '../../BurnCartelPlayer';
import TopNav from '../TopNav';
import ShareModal from '../ShareModal';
import BCWeekly from '../BCWeekly';
import BottomNav from '../BottomNav';
import Footer from '../Footer';
import './App.scss';

const history = createHashHistory();
const isProd = process.env.NODE_ENV === 'production';

const initProdServices = () => {
  // medium.com/alturasoluciones/how-to-set-up-and-use-google-analytics-in-react-apps-fb057d195d13
  console.log('initializing prod services');
  // GOOGLE ANALYTICS
  ReactGA.initialize('UA-84947411-1');
  const landingPath = window.location.hash.replace('#', '');
  ReactGA.pageview(landingPath);

  history.listen(location => {
    ReactGA.pageview(location.pathname);
  });

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
    this.burnCartelPlayer = new BurnCartelPlayer(
      track => this.setTrack(track),
      play => this.setPlaying(play),
      loading => this.setLoading('track', loading),
      error => this.setError(error),
      currentTime => this.setCurrentTime(currentTime),
      playingCollectionNum => this.setPlayingCollectionNum(playingCollectionNum)
    );
  }

  componentWillMount() {
    this.setState({ isMobile: this.isMobile() });
  }

  state = Object.freeze({
    track: {},
    collections: [],
    currentTime: {
      raw: 0,
      before: '',
      after: ''
    },
    openCollection: {
      idx: 0,
      num: null
    },
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
    didCopy: false,
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

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors.length !== nextState.errors.length) {
      this.logNewError(nextState.errors.reverse()[0]);
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

  getActiveCollectionIdx(bc_weekly_num, collections = this.props.collections) {
    let activeCollectionIdx = 0;

    if (App.isValidUrlParam(bc_weekly_num)) {
      const collectionFromWeekNum = App.weekHasBeenReleased(
        collections,
        bc_weekly_num
      );
      if (collectionFromWeekNum) {
        activeCollectionIdx = collectionFromWeekNum.idx;
      }
    }
    return activeCollectionIdx;
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
          openCollection: { idx: initialCollectionIdx, num: collectionNum }
        });
      }
    });
  }
  setCurrentTime(currentTime) {
    this.setState({ currentTime });
  }

  setTrack(track) {
    this.setState({ track, playButtonHasBeenPressed: true }, () => {
      this.updateTrackPlay(track.id);
    });
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
    this.setState({ playingCollectionNum });
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
    this.setState({ pageReadyForFakeModal: true });
    window.scrollTo(0, 0);
  }

  switchCollectionDesktop(collectionNum, collectionIdx, collections) {
    const currentCollection = collections[collectionIdx];

    if (currentCollection && !currentCollection.tracks) {
      this.fetchCollectionTracks(collectionIdx, collections, true);
    } else if (collectionNum) {
      this.burnCartelPlayer.playCollection(currentCollection, collections);
    }
  }

  isMobile() {
    return window.screen.width < 950;
  }

  // this is called on url change from BCWeekly
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

  fetchCollectionTracks(collectionIdx, collections, playOnLoad) {
    this.setLoading('collectionTracks', true);

    axios
      .get(`${baseUrl}/collections/${collections[collectionIdx].id}/tracks`)
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
          }
        );
      })
      .catch(error => {
        this.setError(error.message);
        this.setLoading('collectionTracks', false);
      });
  }

  scrollToCollection() {
    const { idx } = window;
    if (idx) {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      document.getElementById(idx).scrollIntoView();
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

  render() {
    const track = this.getCurrentTrack();
    // TODO:
    // what's the diff between current track and this.state.track?
    const { playerOpen, playing } = this.state;

    return (
      <Router history={history}>
        <div className={`App ${this.state.playerOpen ? 'shift-up' : ''}`}>
          <Responsive minDeviceWidth={950}>
            <ShareModal
              modalOpen={this.state.modalOpen}
              copiedEpisodeNum={this.state.copiedEpisodeNum}
              closeModal={() =>
                this.setState({ modalOpen: false, didCopy: false })
              }
              setDidCopy={() =>
                this.setState({
                  didCopy: true
                })
              }
              didCopy={this.state.didCopy}
            />
          </Responsive>

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
          {this.state.pageReadyForFakeModal ? null : <TopNav />}
          <Route exact path="/" render={() => <Redirect push to="/weekly" />} />
          <Route
            exact
            path="/:bc_weekly_num"
            render={() => (
              <BCWeekly
                pageReadyForFakeModal={this.state.pageReadyForFakeModal}
                handleModalOpen={episodeNum => {
                  this.setState({
                    copiedEpisodeNum: episodeNum,
                    modalOpen: true
                  });
                }}
                getActiveCollectionIdx={(x, y) =>
                  this.getActiveCollectionIdx(x, y)
                }
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
                switchToCollection={(collectionIdx, collections, playOnLoad) =>
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
                burnCartelPlayer={this.burnCartelPlayer}
                playing={this.state.playing}
                playingCollection={
                  this.state.playing &&
                  this.state.openCollection.num ===
                    this.state.playingCollectionNum
                }
                loadingCollectionTracks={this.state.loading.collectionTracks}
                togglePlay={isTogglingFromCollectionDetail =>
                  this.togglePlay(
                    this.state.openCollection.num ===
                      this.state.playingCollectionNum,
                    isTogglingFromCollectionDetail
                  )
                }
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
          {this.state.pageReadyForFakeModal ? null : (
            <Footer loadingCollections={this.state.loading.collections} />
          )}

          {playerOpen && (
            <BottomNav
              track={track}
              playing={playing}
              playerOpen={this.state.playerOpen}
              currentTime={this.state.currentTime}
              trackLoading={this.state.loading.track}
              togglePlay={() => {
                this.togglePlay();
              }}
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

export default App;
