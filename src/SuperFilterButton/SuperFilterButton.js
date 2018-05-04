import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import superFilterImg from './sample_super_filter.svg';
import css from './SuperFilterButton.css';

const SuperFilterButton = ({ onClick, name, selected }) => {
	const color = selected ? 'pink' : '#fff';

	return (
		<div className="SuperFilterButton" onClick={onClick}>
			<h3
				style={{
					background: '#5f9ea0',
					color,
					fontSize: '26px',
					lineHeight: '50px',
					margin: '10px',
					padding: '2%',
					position: 'relative',
					textAlign: 'center'
				}}
			>
				{name}
				{/* <Image
								src={superFilterImg}
								width={100}
								height={100}
								onClick={onClick}
							/> */}
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
