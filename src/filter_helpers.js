const availableTrackFilters = {
	sort_type: {
		HOT: 'hot',
		LATEST: 'latest',
		TOP: 'top',
		RANDOM: 'random'
	},
	track_type: {
		ANY: -1,
		REMIX: 1,
		MIX: 2,
		BC: 'is_bc'
	},
	date_range: {
		PAST_DAY: 2,
		PAST_WEEK: 7,
		PAST_MONTH: 30,
		PAST_YEAR: 365,
		ALL_TIME: -1
	}
};

const displayFilters = {
	sortType: [
		{ menuItem: '🔥 hot', value: availableTrackFilters.sort_type.HOT },
		{ menuItem: '🚀 latest', value: availableTrackFilters.sort_type.LATEST },
		{ menuItem: '💯 top', value: availableTrackFilters.sort_type.TOP },
		{ menuItem: '🔀 random', value: availableTrackFilters.sort_type.RANDOM }
	],
	trackType: [
		{ menuItem: 'Any', value: availableTrackFilters.track_type.ANY },
		{ menuItem: 'Remix', value: availableTrackFilters.track_type.REMIX },
		{ menuItem: 'Mix', value: availableTrackFilters.track_type.MIX },
		{ menuItem: 'BC', value: availableTrackFilters.track_type.BC }
	],
	dateRange: [
		{ value: availableTrackFilters.date_range.PAST_DAY, text: 'Past day' },
		{ value: availableTrackFilters.date_range.PAST_WEEK, text: 'Past week' },
		{ value: availableTrackFilters.date_range.PAST_MONTH, text: 'Past month' },
		{ value: availableTrackFilters.date_range.PAST_YEAR, text: 'Past year' },
		{ value: availableTrackFilters.date_range.ALL_TIME, text: 'All time' }
	]
};

const homeFilters = {
	sort_type: availableTrackFilters.sort_type.HOT,
	track_type: availableTrackFilters.track_type.ANY,
	date_range: availableTrackFilters.date_range.PAST_WEEK,
	page: 1,
	is_submission: false
};

const baseFilters = {
	is_submission: false,
	page: 1
};

const mainFilters = {
	Trending: {
		name: 'Trending',
		filters: {
			date_range: 7,
			sort_type: 'hot',
			track_type: -1,
			...baseFilters
		}
	},
	'Hot Mixes': {
		name: 'Hot Mixes',
		filters: {
			date_range: 7,
			sort_type: 'hot',
			track_type: 2,
			...baseFilters
		}
	},
	'BC Picks': {
		name: 'BC Picks',
		filters: {
			date_range: 365,

			sort_type: 'latest',
			track_type: -1,
			...baseFilters
		}
	},
	'Top Remixes': {
		name: 'Top Remixes',
		filters: {
			date_range: 7,
			sort_type: 'top',
			track_type: 1,
			...baseFilters
		}
	},
	Latest: {
		name: 'Latest',
		filters: {
			date_range: 7,
			sort_type: 'latest',
			track_type: -1,
			...baseFilters
		}
	}
};
//
export { availableTrackFilters, displayFilters, homeFilters, mainFilters };
