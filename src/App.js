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
import Feed from './feed';
import BCSearch from './bc_search';
import { baseUrl } from './config';
import FiltersMenu from './filters_menu';
import './App.css';

// const url = process.env.apiUrl || 'http://the-bc-api.herokuapp.com/tracks';
const url = `${baseUrl}/tracks`;

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
		donePaginating: false,
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
			this.updateTracks(
				nextState.filters,
				nextState.filters.page !== this.state.filters.page
			);
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
					// loading first page
					this.setState({
						tracks: results.data.data.tracks,
						loading: false,
						donePaginating: false
					});
				}
				if (!this.state.donePaginating) {
					this.checkForNextPagination(results.data.metadata.next_href);
				}
			})
			.catch(error => {
				this.setState({ error: error.message, loading: false });
			});
	}

	checkForNextPagination(next_href) {
		axios
			.get(next_href)
			.then(results => {
				if (!results.data.data.tracks.length) {
					this.setState({ donePaginating: true });
				}
			})
			.catch(error => {
				this.setState({ error: error.message, loading: false });
			});
	}

	render() {
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

					<FiltersMenu
						onSortFilterChange={data =>
							this.setState({
								filters: {
									...this.state.filters,
									sort_type: data.panes[data.activeIndex].value,
									page: 1
								}
							})}
						onDateRangeFilterChange={data =>
							this.setState({
								filters: {
									...this.state.filters,
									date_range: data.value,
									page: 1
								}
							})}
						onIsBCFilterChange={data => {
							this.setState({
								filters: { ...this.state.filters, is_bc: data.checked }
							});
						}}
						onTrackTypeFilterChange={data => {
							const { value } = data.panes[data.activeIndex];
							this.setState({
								filters: {
									...this.state.filters,
									track_type: value,
									page: 1
								}
							});
						}}
					/>
				</Segment>

				<Segment className="App-feed-container">
					{this.state.loading ? (
						<Dimmer active inverted>
							<Loader />
						</Dimmer>
					) : null}

					<Feed tracks={this.state.tracks} />
					<Button
						loading={this.state.loading}
						disabled={this.state.donePaginating}
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
