import React, { Component } from 'react';
import { Container, Segment, Image, Grid, Message, Responsive } from 'semantic-ui-react';
import * as _ from 'lodash';
import axios from 'axios';
import SoundCloudAudio from 'soundcloud-audio';
import logo from './logo.png';
import Feed from './feed';
import RightSideMenu from './right_side_menu';
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

	constructor(props) {
		super(props);
		this.getTrackById = this.getTrackById.bind(this);
	}

	state = Object.freeze({
		filters: {
			sort_type: 'hot',
			date_range: 7,
			page: 1
		},
		playing: false,
		playingTrackId: undefined,
		donePaginating: false,
		tracks: [],
		error: null,
		loading: false,
		unsplashPhoto: null
	});

	componentWillMount() {
		this.scAudio = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
		this.updateTracks(this.state.filters);
	}

	componentWillUpdate(nextProps, nextState) {
		if (!_.isEqual(nextState.filters, this.state.filters)) {
			this.updateTracks(nextState.filters, nextState.filters.page !== this.state.filters.page);
		}
	}

	getTrackById(trackId) {
		return this.state.tracks.filter(({ track }) => {
			return track.id === trackId;
		})[0].track;
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

	renderFeed(columnWidth) {
		return (
			<Grid.Column width={columnWidth}>
				<Feed
					tracks={this.state.tracks}
					playing={this.state.playing}
					loading={this.state.loading}
					donePaginating={this.state.donePaginating}
					paginate={() => {
						this.setState({
							filters: {
								...this.state.filters,
								page: this.state.filters.page + 1
							}
						});
					}}
					playingTrackId={this.state.playingTrackId}
					togglePlay={trackId => {
						if (this.state.playing && this.state.playingTrackId === trackId) {
							this.scAudio.pause();
							this.setState({ playing: !this.state.playing });
						} else if (this.state.playing && this.state.playingTrackId !== trackId) {
							this.scAudio.pause();
							this.scAudio.play({
								streamUrl: this.getTrackById(trackId).stream_url
							});
						} else if (!this.state.playing && this.state.playingTrackId === trackId) {
							this.scAudio.play({
								streamUrl: this.getTrackById(trackId).stream_url
							});
							this.setState({ playing: !this.state.playing });
						} else {
							// !this.state.playing && this.state.playingTrackId !== trackId
							this.scAudio.play({
								streamUrl: this.getTrackById(trackId).stream_url
							});
							this.setState({ playing: !this.state.playing });
						}

						if (this.state.playingTrackId !== trackId) {
							this.setState({ playingTrackId: trackId });
						}
					}}
				>
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
				</Feed>
			</Grid.Column>
		);
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
						{/* <BCSearch
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
						/> */}
					</Segment>
				</Segment>

				<Grid>
					<Responsive minWidth={768}>{this.renderFeed(12)}</Responsive>
					<Responsive maxWidth={767}>{this.renderFeed(16)}</Responsive>

					<Responsive minWidth={768}>
						<Grid.Column width={4}>
							<RightSideMenu />
						</Grid.Column>
					</Responsive>
				</Grid>
			</Container>
		);
	}
}

export default App;
