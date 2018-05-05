import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import superFilterImg from './sample_super_filter.svg';
import css from './SuperFilterButton.css';

const SuperFilterButton = ({ onClick, name, selected }) => {
	const color = selected ? 'pink' : '#fff';

	return (
		<div
			className="SuperFilterButton"
			onClick={onClick}
			style={{
				width: 'auto',
				height: '100%',
				padding: '2%',
				margin: '2%',
				background: '#5f9ea0'
			}}
		>
			<h3
				style={{
					color,
					fontSize: '20px',
					margin: '0px',
					padding: '2%',
					position: 'relative',
					textAlign: 'center'
				}}
			>
				{name}
			</h3>
		</div>
	);
};

const { func, bool, string } = PropTypes;

SuperFilterButton.propTypes = {
	onClick: func.isRequired,
	name: string.isRequired,
	selected: bool
};

SuperFilterButton.defaultProps = {
	selected: false
};

export default SuperFilterButton;
