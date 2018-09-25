import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './NextButton.css';

const NextButton = ({ onClick, size, iconName, className }) => (
	<div className={className}>
		<Icon
			name={iconName}
			size={size}
			color="pink"
			className="App-filters-toggle-icon"
			onClick={onClick}
		/>
	</div>
);

const { string, func } = PropTypes;

NextButton.propTypes = {
	size: string,
	iconName: string,
	className: string,
	onClick: func.isRequired
};

NextButton.defaultProps = {
	size: 'large',
	iconName: 'fast forward',
	className: 'NextButton'
};

export default NextButton;
