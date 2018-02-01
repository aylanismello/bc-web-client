import React from 'react';
import logo from './bc_logo.png';

const BCLogo = ({ width }) => (
	<div style={{ width: `${width}px` }}>
		<a
			href="/"
			style={{
				width: '100%',
				height: 'auto'
			}}
		>
			<img src={logo} className="App-logo" />
		</a>
	</div>
);

BCLogo.defaultProps = {
	width: 100
};

export default BCLogo;
