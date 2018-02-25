import { Segment, Tab, Radio, Select, Grid } from 'semantic-ui-react';
import React from 'react';
import './FiltersMenu.css';

const sortingPanes = [
	{ menuItem: '🔥', value: 'hot' },
	{ menuItem: '🚀', value: 'latest' },
	{ menuItem: '💯', value: 'top' },
	{ menuItem: '🔀', value: 'random' }
];

const trackTypePanes = [
	{ menuItem: 'Any', value: -1 },
	{ menuItem: 'Remix', value: 1 },
	{ menuItem: 'Mix', value: 2 },
	{ menuItem: 'BC', value: 'is_bc' }
];

const dateRangeOptions = [
	{ value: 2, text: 'Past day' },
	{ value: 7, text: 'Past week' },
	{ value: 30, text: 'Past month' },
	{ value: 365, text: 'Past year' },
	{ value: -1, text: 'All time' }
];

const FiltersMenu = ({
	onSortFilterChange,
	onTrackTypeFilterChange,
	onIsBCFilterChange,
	onDateRangeFilterChange,
	visible
}) => {
	return (
		<div className="App-filters-container" basic style={visible ? {} : { display: 'none' }}>
			<div className="App-filters">
				{/*  CHANGE THESE TO UNCONTROLLED COMPONENTS so that outer filter changes change them */}
				<Select
					onChange={(e, data) => onDateRangeFilterChange(data)}
					compact
					placeholder="Select date range"
					options={dateRangeOptions}
				/>
				<Tab
					panes={sortingPanes}
					defaultActiveIndex={0}
					onTabChange={(e, data) => onSortFilterChange(data)}
					menu={{
						color: 'teal',
						inverted: true,
						attached: false,
						tabular: false,
						borderless: true
					}}
				/>
				<Tab
					panes={trackTypePanes}
					defaultActiveIndex={0}
					onTabChange={(e, data) => onTrackTypeFilterChange(data)}
					menu={{
						color: 'blue',
						inverted: true,
						attached: false,
						tabular: false,
						borderless: true
					}}
				/>
			</div>

			{/*

			<Radio
				onChange={(e, data) => onIsBCFilterChange(data)}
				label="📻"
				toggle
			/>

			*/}
		</div>
	);
};

export default FiltersMenu;
