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
	state = {
		selectedIdx: 0
	};

	componentWillMount() {
		this.props.setTrackFilters(this.props.superFilters[0].filters);
	}

	componentWillUpdate(nextProps) {
		if (nextProps.superFilterType !== this.props.superFilterType) {
			nextProps.setTrackFilters(nextProps.superFilters[0].filters);
		}
	}

	render() {
		const { setTrackFilters, superFilters, superFilterType } = this.props;
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
									setTrackFilters(superFilter.filters);
								}}
								selected={idx === selectedIdx}
							/>
						</div>
					))}
				</Slider>
				<Segment>
					{' '}
					{
						SUPER_FILTER_DESCRIPTIONS[superFilterType][
							superFilters[selectedIdx].name
						]
					}{' '}
				</Segment>
			</div>
		);
	}
}

const { func, objectOf, string } = PropTypes;

SuperFilterPanel.propTypes = {
	setTrackFilters: func.required,
	superFilters: objectOf(string).required,
	superFilterType: string.required
};

export default SuperFilterPanel;
