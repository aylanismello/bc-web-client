import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import ScrollToTop from '../scroll_to_top';
import TopNav from '../TopNav';
import HomeBCWeekly from '../HomeBCWeekly';
import './App.scss';

class App extends Component {
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
