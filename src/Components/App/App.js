import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../config';
import BurnCartelPlayer from '../../BurnCartelPlayer';
import BCModal from '../BCModal';
import TopNav from '../TopNav';
import BCWeekly from '../BCWeekly';
import BottomNav from '../BottomNav';
import Footer from '../Footer';
import './App.scss';

class App extends Component {
  static isValidUrlParam(param) {
    return /^weekly-[0-9]+$/.test(param);
  }

  static weekHasBeenReleased(collections, bc_weekly_num) {
    const weekNum = parseInt(bc_weekly_num.split('-')[1], 10);
    return App.collectionAsHash(collections)[weekNum];
  }

  static collectionAsHash(arrcollections) {
    const collections = {};
    arrcollections.forEach((collection, idx) => {
      collections[collection.collection_num] = { ...collection, idx };
    });
    return collections;
  }

  constructor(props) {
    super(props);
    this.burnCartelPlayer = new BurnCartelPlayer(
      track => this.setTrack(track),
      play => this.setPlaying(play),
      loading => this.setLoading('track', loading),
      error => this.setError(error),
      currentTime => this.setCurrentTime(currentTime)
    );
  }

  state = Object.freeze({
    track: {},
    collections: [],
    isFromEmail: false,
    currentTime: {
      raw: 0,
      before: '',
      after: ''
    },
    playerOpen: true,
    initialCollectionIdx: 0,
    hasBeenPlayed: false,
    playing: false,
    repeat: false,
    visualize: false,
    modalOpen: false,
    didCopy: false,
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
      toast(nextState.errors.reverse()[0], {
        position: 'top-right',
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false
      });
    }
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

  setCollections(collections, isPreselectedCollection, initialCollectionIdx) {
    this.setState({ collections }, () => {
      if (isPreselectedCollection) {
        this.setState({ initialCollectionIdx });
      }
    });
  }
  setCurrentTime(currentTime) {
    this.setState({ currentTime });
  }

  setTrack(track) {
    this.setState({ track, hasBeenPlayed: true });
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
  switchToCollection(collectionIdx, collections, playOnLoad = true) {
    // this is a combo FETCH + PLAY operation
    this.setState({
      hasBeenPlayed: true
    });
    // WE ALWAYS scroll to collection
    // when we're waiting for the tracks and when they're available,
    // because we need to recenter the track item after the tracks rende
    this.scrollToCollection(collectionIdx);
    
    if (!collections[collectionIdx].tracks) {
      this.fetchCollectionTracks(collectionIdx, collections, playOnLoad);
    } else {
      this.burnCartelPlayer.playCollection(
        collections[collectionIdx],
        collections
      );
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
            this.scrollToCollection(collectionIdx);
          }
        );
      })
      .catch(error => {
        this.setError(error.message);
        this.setLoading('collectionTracks', false);
      });
  }

  scrollToCollection(collectionIdx) {
    const width = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const isMobile = width <= 950;

    if (isMobile && window.location.href.includes('-')) {
      console.log('do shit');
      document.getElementById(`${collectionIdx}`).scrollIntoView();
      this.setState({ showTracklist: true });
    }
  }

  togglePlay() {
    if (!this.state.hasBeenPlayed) {
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

  toggleRepeat() {
    this.setState({ repeat: !this.state.repeat }, () => {
      if (this.state.repeat) {
        this.burnCartelPlayer.setRepeat(true);
      } else {
        this.burnCartelPlayer.setRepeat(false);
      }
    });
  }

  toggleVisualize() {
    this.setState({ visualize: !this.state.visualize });
  }

  getCurrentTrack() {
    let currentTrack = this.state.track;
    const { initialCollectionIdx, collections } = this.state;
    if (
      !this.state.hasBeenPlayed &&
      collections[initialCollectionIdx] &&
      collections[initialCollectionIdx].tracks
    ) {
      currentTrack = collections[initialCollectionIdx].tracks[1];
    }
    return currentTrack;
  }

  render() {
    const track = this.getCurrentTrack();
    const { playerOpen, playing } = this.state;
    return (
      <Router>
        <div className={`App ${this.state.playerOpen ? 'shift-up' : ''}`}>
          <BCModal
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
          <TopNav />
          <Route exact path="/" render={() => <Redirect push to="/weekly" />} />
          <Route
            exact
            path="/:bc_weekly_num"
            render={() => (
              <BCWeekly
                handleModalOpen={episodeNum =>
                  this.setState({
                    modalOpen: true,
                    copiedEpisodeNum: episodeNum
                  })
                }
                getActiveCollectionIdx={(x, y) =>
                  this.getActiveCollectionIdx(x, y)
                }
                setCollections={(x, y, z) => this.setCollections(x, y, z)}
                track={track}
                switchToCollection={(
                  collectionIdx,
                  collections,
                  playOnLoad = true
                ) =>
                  this.switchToCollection(
                    collectionIdx,
                    collections,
                    playOnLoad
                  )
                }
                showTracklist={this.state.showTracklist}
                setPlaying={isPlaying => this.setPlaying(isPlaying)}
                setError={error => this.setError(error)}
                scrollToCollection={idx => this.scrollToCollection(idx)}
                burnCartelPlayer={this.burnCartelPlayer}
                loading={this.state.loading}
                playing={this.state.playing}
                disablePlayerForcedOpen={() => {}}
                togglePlay={() => this.togglePlay()}
                playerOpen={this.state.playerOpen}
                collections={this.state.collections}
                trackLoading={this.state.loading.track}
                setLoading={(resource, state) =>
                  this.setLoading(resource, state)
                }
              />
            )}
          />
          <Footer loadingCollections={this.state.loading.collections} />
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
