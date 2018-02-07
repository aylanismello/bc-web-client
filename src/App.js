import React, { Component } from 'react';
import { Container, Segment, Tab, Sidebar, Message, Icon, Menu } from 'semantic-ui-react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import SoundCloudAudio from 'soundcloud-audio';
import BCSearch from './bc_search';
import Feed from './feed';
import BCMap from './bc_map';
import BCUsers from './bc_users';
import { baseUrl } from './config';
import SideMenu from './side_menu';
import About from './about';
import Submit from './submit';
import Curators from './curators';
import BCLogo from './bc_logo';
import TabbedSegment from './tabbed_segment';
import FiltersMenu from './filters_menu';
import './App.css';

class App extends Component {
	static formatFilters(trackFilters) {
		if (trackFilters.date_range === -1 && trackFilters.track_type === -1) {
			const { date_range, track_type, ...newFilters } = trackFilters;
			return newFilters;
		} else if (trackFilters.date_range === -1) {
			const { date_range, ...newFilters } = trackFilters;
			return newFilters;
		} else if (trackFilters.track_type === -1) {
			const { track_type, ...newFilters } = trackFilters;
			return newFilters;
		}

		return trackFilters;
	}

	constructor(props) {
		super(props);
		this.getTrackById = this.getTrackById.bind(this);
	}

	state = Object.freeze({
		trackFilters: {
			sort_type: 'hot',
			date_range: 7,
			page: 1
		},
		soundcloudUserFilters: {},
		playing: false,
		playingTrackId: undefined,
		donePaginating: false,
		tracks: [],
		curators: [],
		error: null,
		loading: false,
		unsplashPhoto: null,
		firstRequestMade: false,
		sideMenuVisible: false,
		bottomMenuVisible: false
	});

	componentWillMount() {
		this.scAudio = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
		this.updateTracks(this.state.trackFilters);
		this.fetchCurators();
		setTimeout(() => {
			this.setState({ firstRequestMade: true });
		}, 500);
	}

	componentWillUpdate(nextProps, nextState) {
		if (!_.isEqual(nextState.trackFilters, this.state.trackFilters)) {
			this.updateTracks(
				nextState.trackFilters,
				nextState.trackFilters.page !== this.state.trackFilters.page
			);
		}
	}

	fetchCurators() {
		axios
			.get(`${baseUrl}/soundcloud_users`, { params: { is_curator: true } })
			.then(results => {
				this.setState({
					curators: results.data.data.soundcloud_users
				});
			})
			.catch(error => {
				this.setState({ error: error.message });
			});
	}

	getTrackById(trackId) {
		return this.state.tracks.filter(({ track }) => {
			return track.id === trackId;
		})[0].track;
	}

	tracksWithPosition() {
		return this.state.tracks.filter(track => track.publisher[0].location).map(track => {
			return {
				...track,
				publisher: {
					...track.publisher[0],
					position: [track.publisher[0].lng, track.publisher[0].lat]
				}
			};
		});
	}
	updateTracks(trackFilters, paginate = false) {
		this.setState({ loading: true });

		axios
			.get(`${baseUrl}/tracks`, { params: App.formatFilters(trackFilters) })
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

	toggleSidebar(options = {}) {
		const { clickedOutsideMenu } = options;
		if (clickedOutsideMenu && this.state.sideMenuVisible) {
			this.setState({ sideMenuVisible: false });
		} else if (!clickedOutsideMenu) {
			this.setState({ sideMenuVisible: !this.state.sideMenuVisible });
		}
	}

	toggleBottomMenu() {
		this.setState({ bottomMenuVisible: !this.state.bottomMenuVisible });
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
			<Router>
				<div className="App-container">
					<Sidebar.Pushable className="App">
						<Segment
							className="App-top-nav"
							onClick={() => this.toggleSidebar({ clickedOutsideMenu: true })}
						>
							<Icon
								name="content"
								size="big"
								color="blue"
								className="App-sidebar-button"
								onClick={() => this.toggleSidebar()}
							/>

							<Link to="/">
								<BCLogo />
							</Link>

							<BCSearch
								setFilter={({ param, value }) => {
									const {
										location_id,
										soundcloud_user_id,
										...oldFilters
									} = this.state.trackFilters;

									if (value === 'reset') {
										this.setState({ trackFilters: oldFilters });
									} else {
										const newFilter = {};
										newFilter[param] = value;
										this.setState({
											trackFilters: { ...oldFilters, ...newFilter }
										});
									}
								}}
							/>
						</Segment>
						<SideMenu
							visible={this.state.sideMenuVisible}
							clickedOnMenuItem={() => this.toggleSidebar({ clickedOutsideMenu: true })}
						/>

						<Sidebar.Pusher
							onClick={() => this.toggleSidebar({ clickedOutsideMenu: true })}
							as={Container}
						>
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

							<Route
								exact
								path="/"
								render={() => (
									<Container>
										<Tab
											menu={{ secondary: true, pointing: true }}
											panes={[
												{
													menuItem: 'Tracks ⬆️',
													render: () => (
														<TabbedSegment
															loading={this.state.loading}
															firstRequestMade={this.state.firstRequestMade}
														>
															<Feed
																tracks={this.state.tracks}
																playing={this.state.playing}
																loading={this.state.loading}
																donePaginating={this.state.donePaginating}
																paginate={() => {
																	this.setState({
																		trackFilters: {
																			...this.state.trackFilters,
																			page: this.state.trackFilters.page + 1
																		}
																	});
																}}
																playingTrackId={this.state.playingTrackId}
																togglePlay={trackId => {
																	if (this.state.playing && this.state.playingTrackId === trackId) {
																		this.scAudio.pause();
																		this.setState({
																			playing: !this.state.playing
																		});
																	} else if (
																		this.state.playing &&
																		this.state.playingTrackId !== trackId
																	) {
																		this.scAudio.pause();
																		this.scAudio.play({
																			streamUrl: this.getTrackById(trackId).stream_url
																		});
																	} else if (
																		!this.state.playing &&
																		this.state.playingTrackId === trackId
																	) {
																		this.scAudio.play({
																			streamUrl: this.getTrackById(trackId).stream_url
																		});
																		this.setState({
																			playing: !this.state.playing
																		});
																	} else {
																		// !this.state.playing && this.state.playingTrackId !== trackId
																		this.scAudio.play({
																			streamUrl: this.getTrackById(trackId).stream_url
																		});
																		this.setState({
																			playing: !this.state.playing
																		});
																	}

																	if (this.state.playingTrackId !== trackId) {
																		this.setState({ playingTrackId: trackId });
																	}
																}}
															/>
														</TabbedSegment>
													)
												},
												{
													menuItem: 'Map 🗺',
													render: () => <BCMap tracks={this.tracksWithPosition()} />
												},
												{
													menuItem: 'Artists 💃',
													render: () => (
														<TabbedSegment
															loading={this.state.loading}
															firstRequestMade={this.state.firstRequestMade}
														>
															<BCUsers tracks={this.state.tracks} />
														</TabbedSegment>
													)
												}
											]}
										/>
									</Container>
								)}
							/>

							<Route path="/curators" render={() => <Curators curators={this.state.curators} />} />
							<Route path="/submit" render={() => <Submit />} />
							<Route path="/about" component={About} />
						</Sidebar.Pusher>
					</Sidebar.Pushable>

					<div className="App-bottom-nav-container">
						<div className="App-bottom-nav">
							<FiltersMenu
								visible={this.state.bottomMenuVisible}
								onSortFilterChange={data =>
									this.setState({
										trackFilters: {
											...this.state.trackFilters,
											sort_type: data.panes[data.activeIndex].value,
											page: 1
										}
									})}
								onDateRangeFilterChange={data =>
									this.setState({
										trackFilters: {
											...this.state.trackFilters,
											date_range: data.value,
											page: 1
										}
									})}
								onIsBCFilterChange={data => {
									this.setState({
										trackFilters: {
											...this.state.trackFilters,
											is_bc: data.checked
										}
									});
								}}
								onTrackTypeFilterChange={data => {
									const { value } = data.panes[data.activeIndex];
									if (value === 'is_bc') {
										this.setState({
											trackFilters: {
												...this.state.trackFilters,
												// reset trackType to be any, which is -1
												track_type: -1,
												page: 1,
												is_bc: true
											}
										});
									} else {
										this.setState({
											trackFilters: {
												...this.state.trackFilters,
												track_type: value,
												page: 1,
												is_bc: false
											}
										});
									}
								}}
							/>
							<div className="App-filters-toggle-icon-container">
								<Icon
									name="options"
									size="huge"
									color="blue"
									className="App-filters-toggle-icon"
									onClick={() => this.toggleBottomMenu()}
								/>
							</div>
						</div>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
