import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import superFilterImg from './sample_super_filter.svg';

const SuperFilterButton = ({ setFilters, name }) => {
	return (
		<div onClick={setFilters}>
			<h3
				style={{
					background: '#5f9ea0',
					color: '#fff',
					fontSize: '36px',
					lineHeight: '100px',
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
								onClick={setFilters}
							/> */}
			</h3>
		</div>
	);
};

export default SuperFilterButton;
