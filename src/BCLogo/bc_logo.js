import React from 'react';
import logo from './bc_logo_transparent.png';
import './bc_logo.css';

const BCLogo = ({ width }) => (
	<div className="BCLogo-container" style={{ width: `${width}px` }}>
		<img src={logo} className="App-logo" />
	</div>
);

BCLogo.defaultProps = {
	width: 100
};

export default BCLogo;
