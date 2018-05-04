import React from 'react';
import Slider from 'react-slick';
import SuperFilterButton from '../SuperFilterButton';
import './SuperFilterPanel.css';

const settings = {
	infinite: false,
	speed: 500,
	dots: true,
	autoplay: false,
	slidesToShow: 4,
	slidesToScroll: 4,
	responsive: [
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		},
		{ breakpoint: 1000, settings: { slidesToShow: 3, slidesToScroll: 3 } },
		{ breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } }
	]
};

const SuperFilterPanel = ({ setFilters, superFilters }) => (
	<div>
		<Slider className="explore-panel-slider" {...settings}>
			{superFilters.map((superFilter, idx) => (
				<div>
					<SuperFilterButton
						name={superFilter.name}
						setFilters={() => setFilters(superFilter.filters)}
					/>
				</div>
			))}
		</Slider>
    <div>
      	This shows metadata specific to the super filter chosen.
    </div>
	</div>
);

export default SuperFilterPanel;
