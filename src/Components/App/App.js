import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import BurnCartelPlayer from '../../BurnCartelPlayer';
import TopNav from '../TopNav';
import BCWeekly from '../BCWeekly';
import BottomNav from '../BottomNav';
import Footer from '../Footer';
import './App.scss';

class App extends Component {
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
    currentTime: {
      raw: 0,
      before: '',
      after: ''
    },
    playerOpen: false,
    playing: false,
    repeat: false,
    visualize: false,
    loading: {
      playlists: true,
      track: true
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

  setCurrentTime(currentTime) {
    this.setState({ currentTime });
  }

  setTrack(track) {
    this.setState({ track });
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

  togglePlay() {
    this.setState({ playing: !this.state.playing }, () => {
      if (this.state.playing) {
        this.burnCartelPlayer.resume();
      } else {
        this.burnCartelPlayer.pause();
      }
    });
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

  render() {
    const { track, playerOpen, playing } = this.state;
    return (
      <Router>
        <div className={`App ${this.state.playerOpen ? 'shift-up' : ''}`}>
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
                handleModalOpen={() => alert('god is fake')}
                track={track}
                setPlaying={isPlaying => this.setPlaying(isPlaying)}
                setError={error => this.setError(error)}
                burnCartelPlayer={this.burnCartelPlayer}
                loading={this.state.loading}
                playing={this.state.playing}
                togglePlay={() => this.togglePlay()}
                playerOpen={this.state.playerOpen}
                trackLoading={this.state.loading.track}
                setLoading={(resource, state) =>
                  this.setLoading(resource, state)
                }
              />
            )}
          />
          <Footer loadingPlaylists={this.state.loading.playlists} />
          {playerOpen && (
            <BottomNav
              track={track}
              playing={playing}
              currentTime={this.state.currentTime}
              trackLoading={this.state.loading.track}
              togglePlay={() => this.togglePlay()}
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
