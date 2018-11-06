import React, { Component } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import SoundCloudAudio from "soundcloud-audio";
import TopNav from "../TopNav";
import BCWeekly from "../BCWeekly";
import BottomNav from "../BottomNav";
import "./App.scss";

class App extends Component {
  state = {
    track: {},
    playerOpen: false
  };

  componentWillMount() {
    window.scAudio = new SoundCloudAudio("caf73ef1e709f839664ab82bef40fa96");
  }

  setTrack(track) {
    this.setState({ track });
  }

  setPlayerOpen() {
    if (!this.state.playerOpen) this.setState({ playerOpen: true });
  }

  render() {
    const { track, playerOpen } = this.state;
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
                setTrack={track => this.setTrack(track)}
              />
            )}
            setPlayerOpen={() => this.setPlayerOpen()}
          />
          <Route
            exact
            path="/:bc_weekly_num"
            render={() => (
              <BCWeekly
                track={track}
                setTrack={track => this.setTrack(track)}
                setPlayerOpen={() => this.setPlayerOpen()}
              />
            )}
          />
          {playerOpen && <BottomNav track={track} />}
        </div>
      </Router>
    );
  }
}

export default App;
