import { Segment, Tab, Radio, Select, Grid } from 'semantic-ui-react';
import React from 'react';
import './FiltersMenu.css';

const sortingPanes = [
	{ menuItem: 'Hot 🔥', value: 'hot' },
	{ menuItem: 'Latest 🚀', value: 'latest' },
	{ menuItem: 'Top 💯', value: 'top' },
	{ menuItem: 'Shuffle 🔀', value: 'random' }
];

const trackTypePanes = [
	{ menuItem: 'Any', value: -1 },
	{ menuItem: 'Remix', value: 1 },
	{ menuItem: 'Mix', value: 2 },
	{ menuItem: 'On BC Radio', value: 'is_bc' }
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
	onDateRangeFilterChange
}) => {
	return (
		<Segment className="App-filters-container" basic>
			<div
				className="App-filters"
				style={{ display: 'flex', justifyContent: 'space-between' }}
			>
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
				<Select
					onChange={(e, data) => onDateRangeFilterChange(data)}
					compact
					placeholder="Select date range"
					options={dateRangeOptions}
				/>
			</div>

			{/*

			<Radio
				onChange={(e, data) => onIsBCFilterChange(data)}
				label="📻"
				toggle
			/>

			*/}
		</Segment>
	);
};

export default FiltersMenu;
