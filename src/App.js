import React, { Component } from 'react';
import {
	Container,
	Segment,
	Image,
	Tab,
	Select,
	Message,
	Button,
	Dimmer,
	Loader,
	Radio,
	Dropdown
} from 'semantic-ui-react';
import * as _ from 'lodash';
import axios from 'axios';
import logo from './logo.png';
import TableFeed from './table_feed';
import BCSearch from './bc_search';
import './App.css';

const url = process.env.apiUrl || 'http://the-bc-api.herokuapp.com/tracks';

class App extends Component {
	static formatFilters(filters) {
		if (filters.date_range === -1 && filters.track_type === -1) {
			const { date_range, track_type, ...newFilters } = filters;
			return newFilters;
		} else if (filters.date_range === -1) {
			const { date_range, ...newFilters } = filters;
			return newFilters;
		} else if (filters.track_type === -1) {
			const { track_type, ...newFilters } = filters;
			return newFilters;
		}

		return filters;
	}

	state = Object.freeze({
		filters: {
			sort_type: 'hot',
			date_range: 7,
			page: 1
		},
		tracks: [],
		error: null,
		loading: false,
		unsplashPhoto: null
	});

	componentWillMount() {
		this.updateTracks(this.state.filters);
	}

	componentWillUpdate(nextProps, nextState) {
		if (!_.isEqual(nextState.filters, this.state.filters)) {
			this.updateTracks(nextState.filters, nextState.filters.page !== this.state.filters.page);
		}
	}

	updateTracks(filters, paginate = false) {
		this.setState({ loading: true });

		axios
			.get(url, { params: App.formatFilters(filters) })
			.then(results => {
				if (paginate) {
					this.setState({
						tracks: [...this.state.tracks, ...results.data.data.tracks],
						loading: false
					});
				} else {
					this.setState({ tracks: results.data.data.tracks, loading: false });
				}
			})
			.catch(error => {
				this.setState({ error: error.message, loading: false });
			});
	}

	render() {
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

		return (
			<Container className="App">
				{this.state.error ? (
					<Message
						className="App-error"
						negative
						onDismiss={() => {
							this.setState({ error: null });
						}}
						header="Sorry, something went wrong!"
						content={this.state.error}
					/>
				) : null}

				<Segment
					className="App-top-nav"
					style={{
						backgroundImage: 'linear-gradient(black, gray)'
					}}
				>
					<Segment className="App-logo-segment" basic>
						<Image src={logo} alt="bc_logo" size="small" />
						<BCSearch
							setFilter={({ param, value }) => {
								const { country, city, ...oldFilters } = this.state.filters;

								if (value === 'reset') {
									this.setState({ filters: oldFilters });
								} else {
									const newFilter = {};
									newFilter[param] = value;
									this.setState({ filters: { ...oldFilters, ...newFilter } });
								}
							}}
						/>
					</Segment>
					<Segment className="App-filters" basic>
						<Tab
							panes={sortingPanes}
							defaultActiveIndex={0}
							onTabChange={(e, data) =>
								this.setState({
									filters: {
										...this.state.filters,
										sort_type: data.panes[data.activeIndex].value,
										page: 1
									}
								})}
							menu={{
								color: 'teal',
								inverted: true,
								attached: false,
								tabular: false
							}}
						/>

						<Tab
							panes={trackTypePanes}
							defaultActiveIndex={0}
							onTabChange={(e, data) => {
								const { value } = data.panes[data.activeIndex];
								this.setState({
									filters: {
										...this.state.filters,
										track_type: value,
										page: 1
									}
								});
							}}
							menu={{
								color: 'green',
								inverted: true,
								attached: false,
								tabular: false
							}}
						/>

						<Radio
							onChange={(e, data) => {
								this.setState({
									filters: { ...this.state.filters, is_bc: data.checked }
								});
							}}
							label="📻"
							toggle
						/>

						<Select
							onChange={(e, data) =>
								this.setState({
									filters: {
										...this.state.filters,
										date_range: data.value,
										page: 1
									}
								})}
							compact
							placeholder="tracks from"
							options={[
								{ value: 2, text: 'Past day' },
								{ value: 7, text: 'Past week' },
								{ value: 30, text: 'Past month' },
								{ value: 365, text: 'Past year' },
								{ value: -1, text: 'All time' }
							]}
						/>
					</Segment>
				</Segment>

				<Segment className="App-feed-container">
					{this.state.loading ? (
						<Dimmer active inverted>
							<Loader />
						</Dimmer>
					) : null}

					<TableFeed tracks={this.state.tracks} />
					<Button
						loading={this.state.loading}
						onClick={() => {
							this.setState({
								filters: {
									...this.state.filters,
									page: this.state.filters.page + 1
								}
							});
						}}
					>
						{' '}
						More.{' '}
					</Button>
				</Segment>
			</Container>
		);
	}
}

export default App;
