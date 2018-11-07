import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import SoundCloudAudio from 'soundcloud-audio';
import BurnCartelPlayer from '../BurnCartelPlayer';
import TopNav from '../TopNav';
import BCWeekly from '../BCWeekly';
import BottomNav from '../BottomNav';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.burnCartelPlayer = new BurnCartelPlayer(
      (playlistIdx, playlists) =>
        this.autoSwitchPlaylists(playlistIdx, playlists),
      track => this.setTrack(track),
      play => this.setPlaying(play)
    );
  }

  state = {
    track: {},
    playerOpen: false,
    playing: false
  };

  setTrack(track) {
    this.setState({ track });
  }

  setPlaying(playing) {
    this.setState({ playing, playerOpen: true });
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

  autoSwitchPlaylists(playlistIdx, playlists) {
    this.props.history.push(`/weekly-${playlists[playlistIdx].week_num}`);
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
              />
            )}
          />
          {playerOpen && <BottomNav track={track} playing={playing} togglePlay={() => this.togglePlay()} />}
        </div>
      </Router>
    );
  }
}

export default App;
