import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import superFilterImg from './sample_super_filter.svg';

const SuperFilterButton = ({ setFilters }) => {
	return (
		<Card.Content>
			<Image
				src={superFilterImg}
				width={100}
				height={100}
				onClick={() => setFilters({ sort: 'latest', page: 1 })}
			/>
		</Card.Content>
	);
};

export default SuperFilterButton;
