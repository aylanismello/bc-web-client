import React from 'react';
import { Segment, Tab, Radio, Select, Grid } from 'semantic-ui-react';

const sortingPanes = [
	{ menuItem: 'Hot 🔥', value: 'hot' },
	{ menuItem: 'Latest 🚀', value: 'latest' },
	{ menuItem: 'Top 💯', value: 'top' }
];

const trackTypePanes = [
	{ menuItem: 'Either', value: -1 },
	{ menuItem: 'Remix', value: 1 },
	{ menuItem: 'Mix', value: 2 }
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
		<Segment className="App-filters" basic>
			<Grid container columns={4}>
				<Grid.Column>
					<Tab
						panes={sortingPanes}
						defaultActiveIndex={0}
						onTabChange={(e, data) => onSortFilterChange(data)}
						menu={{
							color: 'teal',
							inverted: true,
							attached: false,
							tabular: false
						}}
					/>
				</Grid.Column>

				<Grid.Column>
					<Tab
						panes={trackTypePanes}
						defaultActiveIndex={0}
						onTabChange={(e, data) => onTrackTypeFilterChange(data)}
						menu={{
							color: 'green',
							inverted: true,
							attached: false,
							tabular: false
						}}
					/>
				</Grid.Column>

				<Grid.Column>
					<Radio
						onChange={(e, data) => onIsBCFilterChange(data)}
						label="📻"
						toggle
					/>
				</Grid.Column>

				<Grid.Column>
					<Select
						onChange={(e, data) => onDateRangeFilterChange(data)}
						compact
						placeholder="Past week"
						options={dateRangeOptions}
					/>
				</Grid.Column>
			</Grid>
		</Segment>
	);
};

export default FiltersMenu;
