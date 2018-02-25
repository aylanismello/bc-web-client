import React from 'react';
import logo from './bc_logo.png';
import './bc_logo.css';

const BCLogo = ({ width }) => (
	<div className="BCLogo-container" style={{ width: `${width}px` }}>
		<img src={logo} className="App-logo" />
	</div>
);

BCLogo.defaultProps = {
	width: 80
};

export default BCLogo;
