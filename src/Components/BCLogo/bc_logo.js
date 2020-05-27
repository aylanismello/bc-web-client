import React from 'react';
import logo from './bc_logo_white.svg';
import './bc_logo.scss';

const BCLogo = ({ centerOnMediaQuery, infoText }) => (
  <div className={`BCLogo${centerOnMediaQuery ? ' CenterOnMediaQuery' : ''}`}>
    <div className="BCLogo-svg">
      <img
        src={logo}
        className="App-logo"
        alt="Burn Cartel Logo"
        draggable={false}
      />
    </div>
    {/* <span
      className="BCLogo-text"
      style={infoText ? { fontSize: '1.4rem' } : {}}
    >
      {' '}
      {infoText || 'BURN CARTEL'}
    </span> */}
  </div>
);

BCLogo.defaultProps = {
  width: 80,
  centerOnMediaQuery: false
};

export default BCLogo;
