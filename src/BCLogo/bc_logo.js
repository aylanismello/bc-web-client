import React from 'react';
import logo from './bc_logo_white.svg';
import './bc_logo.scss';

const BCLogo = () => (
	<div className="BCLogo">
		<div className="BCLogo-svg">
			<img src={logo} className="App-logo" />
		</div>
		<span className="BCLogo-text"> BURN CARTEL 	</span>
	</div>
);

BCLogo.defaultProps = {
	width: 80
};

export default BCLogo;
