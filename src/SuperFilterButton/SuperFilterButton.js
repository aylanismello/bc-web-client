import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import superFilterImg from './sample_super_filter.svg';
import css from './SuperFilterButton.css';

const SuperFilterButton = ({ onClick, name, selected }) => {
	const color = 'pink';
	const fontWeight = selected ? 'bold' : '';
	const fontSize = selected ? '25px' : '20px';

	return (
		<div
			className="SuperFilterButton"
			onClick={onClick}
			style={{
				width: 'auto',
				height: '4rem',
				padding: '2%',
				margin: '2%',
				backgroundColor: 'rgba(0, 0, 0, 0.6)'
			}}
		>
			<span
				style={{
					color,
					fontWeight,
					fontSize,
					margin: '0px',
					padding: '2%',
					position: 'relative',
					textAlign: 'center'
				}}
			>
				{name}
			</span>
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
