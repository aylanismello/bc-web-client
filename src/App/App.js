import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import SoundCloudAudio from 'soundcloud-audio';
import ScrollToTop from '../scroll_to_top';
import TopNav from '../TopNav';
import HomeBCWeekly from '../HomeBCWeekly';
import './App.scss';

class App extends Component {
  componentWillMount() {
    window.scAudio = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
  }

  render() {
    return (
      <Router>
        <ScrollToTop>
          <TopNav />
          <Route exact path="/" render={({ match }) => <HomeBCWeekly params={match.params} />} />
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
