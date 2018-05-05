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

class SuperFilterPanel extends React.Component {
	constructor(props) {
		super(props);
		props.setFilters(props.superFilters[0].filters);
	}

	state = {
		selectedIdx: 0
	};

	render() {
		const {
			setFilters, superFilters, description, superFilterType
		} = this.props;
		const { selectedIdx } = this.state;
		return (
			<div className="SuperFilterPanel">
				<Slider className="explore-panel-slider" {...settings}>
					{superFilters.map((superFilter, idx) => (
						<div>
							<SuperFilterButton
								name={superFilter.name}
								onClick={() => {
									this.setState({ selectedIdx: idx });
									setFilters(superFilter.filters);
								}}
								selected={idx === selectedIdx}
							/>
						</div>
					))}
				</Slider>
				<Segment> {SUPER_FILTER_DESCRIPTIONS[superFilterType][superFilters[selectedIdx].name]} </Segment>
			</div>
		);
	}
}

const { func, objectOf, string } = PropTypes;

SuperFilterPanel.propTypes = {
	setFilters: func.isRequired,
	superFilters: objectOf(string).isRequired,
	description: string.isRequired,
	superFilterType: string.isRequired
};

export default SuperFilterPanel;
