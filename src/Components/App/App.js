import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
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
      play => this.setPlaying(play)
    );
  }

  state = Object.freeze({
    track: {},
    playerOpen: false,
    playing: false,
    loading: {
      playlists: true
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
    this.setState({
      loading: { ...this.state.loading, ...newResouceLoadingState }
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

  render() {
    const { track, playerOpen, playing } = this.state;
    return (
      <Router>
        <div className="App">
          <TopNav />
          <Route
            exact
            path="/"
            render={() => (
              <BCWeekly
                track={track}
                setPlaying={isPlaying => this.setPlaying(isPlaying)}
                burnCartelPlayer={this.burnCartelPlayer}
                loading={this.state.loading}
                setLoading={(resource, state) =>
                  this.setLoading(resource, state)
                }
              />
            )}
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
              togglePlay={() => this.togglePlay()}
              goToTrack={whichOne => this.burnCartelPlayer.goToTrack(whichOne)}
            />
          )}
        </div>
      </Router>
    );
  }
}

export default App;
