import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import SoundCloudAudio from 'soundcloud-audio';
import TopNav from '../TopNav';
import BCWeekly from '../BCWeekly';
import './App.scss';

class App extends Component {
  componentWillMount() {
    window.scAudio = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
  }

  render() {
    return (
      <Router>
        <div>
          <TopNav />
          <Route exact path="/" component={BCWeekly} />
          <Route exact path="/:bc_weekly_num" component={BCWeekly} />
        </div>
      </Router>
    );
  }
}

export default App;
