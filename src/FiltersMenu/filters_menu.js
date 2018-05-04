import { Segment, Tab, Radio, Select, Grid, Label } from 'semantic-ui-react';
import React from 'react';
import { availableTrackFilters, displayFilters, homeFilters } from '../filter_helpers';
import './FiltersMenu.css';

const FiltersMenu = ({
	onSortFilterChange,
	onTrackTypeFilterChange,
	onIsBCFilterChange,
	onDateRangeFilterChange,
	visible,
	trackFilters
}) => {
	return (
		<div className="App-filters-container" basic style={visible ? {} : { display: 'none' }}>
			<div className="App-filters">
				<div className="App-filters-filter-container">
					<Label size="large" className="App-filters-filter-pre-text">
						{' '}
						from:{' '}
					</Label>
					<div className="App-filters-select-container">
						<Select
							value={trackFilters.date_range}
							onChange={(e, data) => onDateRangeFilterChange(data)}
							defaultValue={trackFilters.date_range}
							compact
							fluid
							upward
							options={displayFilters.dateRange}
						/>
					</div>
				</div>
				<div className="App-filters-filter-container" id="App-filters-sort">
					<Label size="large" className="App-filters-filter-pre-text">
						{' '}
						sort:{' '}
					</Label>
					<Tab
						panes={displayFilters.sortType}
						activeIndex={displayFilters.sortType.findIndex(i => i.value === trackFilters.sort_type)}
						defaultActiveIndex={0}
						onTabChange={(e, data) => onSortFilterChange(data)}
						menu={{
							color: 'blue',
							inverted: true,
							attached: false,
							tabular: false,
							borderless: true
						}}
					/>
				</div>
				<div className="App-filters-filter-container">
					<Label size="large" className="App-filters-filter-pre-text">
						{' '}
						include:{' '}
					</Label>

					<Tab
						panes={displayFilters.trackType}
						activeIndex={(function () {
							const activeIndex = displayFilters.trackType.findIndex(i => i.value === trackFilters.track_type);
							if (trackFilters.is_bc) {
								// if trackFilters is set to is_bc, then we have to disregard track_type being any (-1)
								return 3;
							} else {
								return activeIndex;
							}
						}())}
						defaultActiveIndex={0}
						onTabChange={(e, data) => onTrackTypeFilterChange(data)}
						menu={{
							color: 'pink',
							inverted: true,
							attached: false,
							tabular: false,
							borderless: true
						}}
					/>
				</div>
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
