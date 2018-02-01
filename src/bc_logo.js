import React from 'react';
import logo from './bc_logo.png';

const BCLogo = ({ width }) => (
	<div style={{ width: `${width}px` }}>
		<img src={logo} className="App-logo" />
	</div>
);

BCLogo.defaultProps = {
	width: 100
};

export default BCLogo;
