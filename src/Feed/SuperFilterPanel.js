import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Segment } from 'semantic-ui-react';
import SuperFilterButton from '../SuperFilterButton';
import './SuperFilterPanel.css';
import { SUPER_FILTER_DESCRIPTIONS } from '../constants';

const settings = {
	infinite: false,
	speed: 700,
	dots: false,
	autoplay: false,
	slidesToShow: 4,
	slidesToScroll: 4,
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
	// const { setTrackFilters, superFilters, superFilterType } = this.props;
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

	if (superfilterId && !loading && superFilters.length) {
		setSuperfilterById(superfilterId);
	}

	return (
		<div
			className="SuperFilterPanel"
			style={image_url && { backgroundImage: `url('${image_url}')` }}
		>
			{!loading ? (
				<div>
					{' '}
					<Slider className="explore-panel-slider" {...settings}>
						{superFilters.sort(sf => sf.position).map(superFilter => (
							<div>
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

const { func, objectOf, string } = PropTypes;

SuperFilterPanel.propTypes = {
	setTrackFilters: func.required,
	superFilters: objectOf(string).required,
	superFilterType: string.required
};

export default SuperFilterPanel;
