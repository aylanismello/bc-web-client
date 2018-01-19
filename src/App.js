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
	Loader
} from 'semantic-ui-react';
import * as _ from 'lodash';
import axios from 'axios';
import logo from './logo.png';
import TableFeed from './table_feed';
import './App.css';

const url = process.env.apiUrl || 'http://the-bc-api.herokuapp.com/tracks';

class App extends Component {
	static formatFilters(filters) {
		if (filters.date_range === -1) {
			const { date_range, ...newFilters } = filters;
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
		loading: false
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
					this.setState({ tracks: results.data.data.tracks, loading: false });
				}
			})
			.catch(error => {
				this.setState({ error: 'something', loading: false });
			});
	}

	render() {
		const sortingPanes = [
			{ menuItem: 'Hot 🔥', value: 'hot' },
			{ menuItem: 'Latest 🚀', value: 'latest' },
			{ menuItem: 'Top 💯', value: 'top' }
		];

		const trackTypePanes = [
			{ menuItem: 'Remix', value: '1' },
			{ menuItem: 'Mix', value: '2' }
		]
		return (
			<Container className="App">
				{this.state.error ? (
					<Message negative className="App-error">
						<Message.Header>Sorry, something went wrong!</Message.Header>
						<Button onClick={() => this.setState({ error: null })} color="pink">
							Got it!
						</Button>
						<p>right!</p>
					</Message>
				) : null}

				<Segment inverted className="App-top-nav">
					<Segment className="App-logo-segment" inverted>
						<Image src={logo} alt="bc_logo" size="small" />
					</Segment>
					<Segment className="App-filters" inverted>
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
							onTabChange={(e, data) =>
								this.setState({
									filters: {
										...this.state.filters,
										track_type: data.panes[data.activeIndex].value,
										page: 1
									}
								})}
							menu={{
								color: 'green',
								inverted: true,
								attached: false,
								tabular: false
							}}
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
