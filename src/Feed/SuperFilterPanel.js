import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Segment } from 'semantic-ui-react';
import SuperFilterButton from '../SuperFilterButton';
import './SuperFilterPanel.css';

const settings = {
	infinite: false,
	speed: 700,
	dots: false,
	autoplay: false,
	slidesToShow: 4,
	slidesToScroll: 4,
	swipeToSlide: true,
	responsive: [
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{ breakpoint: 1000, settings: { slidesToShow: 3, slidesToScroll: 1 } },
		{ breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } }
	]
};

const SuperFilterPanel = props => {
	const {
		superFilters,
		setSuperfilter,
		selectedSuperFilterId,
		loading,
		superfilterId,
		setSuperfilterById
	} = props;
	const description =
		superFilters.filter(sf => sf.id === selectedSuperFilterId)[0] &&
		superFilters.filter(sf => sf.id === selectedSuperFilterId)[0].description;

	const image_url =
		superFilters.filter(sf => sf.id === selectedSuperFilterId)[0] &&
		superFilters.filter(sf => sf.id === selectedSuperFilterId)[0].image_url;

	let startingIdx = 0;
	let newSettings = { ...settings };

	const orderedSuperFilters = loading
		? null
		: superFilters.sort((x, y) => x.position > y.position);

	if (superfilterId && !loading && superFilters.length) {
		setSuperfilterById(superfilterId);
		startingIdx = orderedSuperFilters.findIndex(sf => {
			return sf.id === selectedSuperFilterId;
		});
		newSettings = { ...settings, initialSlide: startingIdx };
	}

	return (
		<div
			className="SuperFilterPanel"
			style={image_url && { backgroundImage: `url('${image_url}')` }}
			key={`outer-${selectedSuperFilterId}`}
		>
			{!loading ? (
				<div key={`inner-${selectedSuperFilterId}`}>
					{' '}
					<Slider className="explore-panel-slider" {...newSettings}>
						{orderedSuperFilters.map(superFilter => (
							<div key={`inner-inner-${selectedSuperFilterId}`}>
								<SuperFilterButton
									name={superFilter.name}
									onClick={() => {
										window.location = `/#feed/${superFilter.superfilter_type}?id=${superFilter.id}`;
									}}
									selected={superFilter.id === selectedSuperFilterId}
								/>
							</div>
						))}
					</Slider>
					{description && <Segment> {description} </Segment>}{' '}
				</div>
			) : null}
		</div>
	);
};

const { instanceOf, string } = PropTypes;

SuperFilterPanel.propTypes = {
	superFilters: instanceOf(Array),
	superFilterType: string
};

export default SuperFilterPanel;
