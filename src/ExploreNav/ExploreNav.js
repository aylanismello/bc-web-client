import React from 'react';
import './ExploreNav.scss';

const ExploreNav = () => (
  <div className="ExploreNav">
    <div className="ExploreNav-tabs">
      <div className="ExploreNav-selected-tab">
        <span className="ExploreNav-tab selected">EXPLORE</span>
        <div className="ExploreNav-Selected-Line" />
      </div>
      <span className="ExploreNav-tab">LOCATIONS</span>
      <span className="ExploreNav-tab">ARTISTS</span>
      <span className="ExploreNav-tab">CURATORS</span>
      <span className="ExploreNav-tab">MIXES</span>
    </div>
    <div className="ExploreNav-Line" />
  </div>
);

export default ExploreNav;
