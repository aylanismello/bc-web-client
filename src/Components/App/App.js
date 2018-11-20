import React, { Component } from 'react';
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
      loading => this.setLoading('track', loading)
    );
  }

  state = Object.freeze({
    track: {},
    playerOpen: false,
    playing: false,
    repeat: false,
    visualize: false,
    loading: {
      playlists: true,
      track: true
    }
  });

  setTrack(track) {
    this.setState({ track });
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
        <div className="App">
          <TopNav />
          <Route
            exact
            path="/"
            render={() => <Redirect push to="/weekly-75" />}
          />
          <Route
            exact
            path="/:bc_weekly_num"
            render={() => (
              <BCWeekly
                track={track}
                setPlaying={isPlaying => this.setPlaying(isPlaying)}
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
          <Footer />
          {playerOpen && (
            <BottomNav
              track={track}
              playing={playing}
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
