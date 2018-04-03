import React, { Component } from 'react';
import { Container, Segment, Tab, Sidebar, Message, Icon, Menu, Item } from 'semantic-ui-react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import SoundCloudAudio from 'soundcloud-audio';
import Feed from './feed';
import { baseUrl } from './config';
import SideMenu from './side_menu';
import Home from './home';
import About from './about';
import Submit from './submit';
import Curators from './curators';
import SoundcloudUser from './soundcloud_user';
import TopNav from './top_nav';
import ScrollToTop from './scroll_to_top';
import FiltersMenu from './filters_menu';
import { homeFilters } from './filter_helpers';
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
			// sort_type: 'hot',
			// date_range: 7,
			// page: 1,
			// is_submission: false
		},
		soundcloudUserFilters: {},
		playing: false,
		query: '',
		playingTrackId: undefined,
		playingTrack: Object.freeze({
			id: undefined,
			data: {}
		}),
		donePaginating: false,
		tracks: [],
		error: null,
		loading: false,
		unsplashPhoto: null,
		firstRequestMade: false,
		sideMenuVisible: false,
		bottomMenuVisible: false,
		showFullSearchBar: false,
		curators: [],
		soundcloudUser: {},
		loadingSoundcloudUser: false
	});

	componentWillMount() {
		this.scAudio = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
		// this.updateTracks(this.state.trackFilters);

		// this should happen separately
		// this.fetchCurators();
	}

	componentWillUpdate(nextProps, nextState) {
		if (!_.isEqual(nextState.trackFilters, this.state.trackFilters)) {
			let paginate;
			if (nextState.trackFilters.page !== this.state.trackFilters.page) {
				// this means we are starting a fresh pagination
				if (nextState.trackFilters.page === 1) {
					paginate = false;
				} else {
					paginate = true;
				}
			}

			this.updateTracks(nextState.trackFilters, paginate);
		}
	}

	// this should happen is fetch curators page
	fetchCurators() {
		this.setState({
			loading: true
		});
		axios
			.get(`${baseUrl}/soundcloud_users`, { params: { is_curator: true } })
			.then(results => {
				this.setState({
					curators: results.data.data.soundcloud_users,
					loading: false
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

	fetchSoundcloudUser(id) {
		this.setState({ loadingSoundcloudUser: true });
		axios.get(`${baseUrl}/soundcloud_users/${id}`).then(results => {
			this.setState({
				soundcloudUser: results.data.data.soundcloud_user,
				loadingSoundcloudUser: false
			});
		});
	}

	togglePlay(trackId) {
		if (this.state.playing && this.state.playingTrack.id === trackId) {
			this.scAudio.pause();
			this.setState({
				playing: !this.state.playing
			});
		} else if (this.state.playing && this.state.playingTrack.id !== trackId) {
			this.scAudio.pause();
			this.scAudio.play({
				streamUrl: this.getTrackById(trackId).stream_url
			});
		} else if (!this.state.playing && this.state.playingTrack.id === trackId) {
			this.scAudio.play({
				streamUrl: this.getTrackById(trackId).stream_url
			});
			this.setState({
				playing: !this.state.playing
			});
		} else {
			// !this.state.playing && this.state.playingTrack.id !== trackId
			this.scAudio.play({
				streamUrl: this.getTrackById(trackId).stream_url
			});
			this.setState({
				playing: !this.state.playing
			});
		}

		if (this.state.playingTrack.id !== trackId) {
			this.setState({
				playingTrack: {
					...this.state.playingTrack,
					id: trackId,
					data: this.state.tracks.find(x => x.track.id === trackId)
				}
			});
		}
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
					// when paginating, scroll to bottom of page
					window.scrollTo(0, 100000);
				} else {
					// loading first page
					// when loading first page, scroll to top of page
					window.scrollTo(0, 0);
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

	feedInstance(displayPage = 'home') {
		return (
			<Feed
				tracks={this.state.tracks}
				displayPage={displayPage}
				playing={this.state.playing}
				loading={this.state.loading}
				donePaginating={this.state.donePaginating}
				trackFilters={this.state.trackFilters}
				setIsSubmission={isSubmission => {
					this.setState({
						trackFilters: {
							...this.state.trackFilters,
							page: 1,
							is_submission: isSubmission
						}
					});
				}}
				paginate={() => {
					this.setState({
						trackFilters: {
							...this.state.trackFilters,
							page: this.state.trackFilters.page + 1
						}
					});
				}}
				playingTrackId={this.state.playingTrack.id}
				togglePlay={trackId => this.togglePlay(trackId)}
			/>
		);
	}

	setFilters(filters) {
		this.setState({
			trackFilters: filters
		});
	}

	setFilter({ param, value }) {
		const { location_id, soundcloud_user_id, ...oldFilters } = this.state.trackFilters;

		if (value === 'reset') {
			this.setState({ trackFilters: oldFilters });
		} else {
			const newFilter = {};
			newFilter[param] = value;
			this.setState({
				trackFilters: { ...oldFilters, ...newFilter }
			});
		}
	}

	fetchHomeTracks() {
		this.setFilters({
			...homeFilters
		});
	}

	submitSearch() {
		window.location = `/#search?q=${this.state.query}`;
	}

	render() {
		return (
			<Router>
				<ScrollToTop>
					<div className="App-container">
						<Sidebar.Pushable
							className="App"
							onClick={() => this.setState({ bottomMenuVisible: false })}
						>
							<TopNav
								toggleSidebar={options => this.toggleSidebar(options)}
								setFilter={val => this.setFilter(val)}
								fetchHomeTracks={() => this.fetchHomeTracks()}
								submitSearch={() => this.submitSearch()}
								query={this.state.query}
								handleSearchChange={value => {
									this.setState({ query: value });
								}}
							/>

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
										<Home
											getHomeTracks={() => this.fetchHomeTracks()}
											loading={this.state.loading}
											setState={state => this.setState(state)}
											trackFilters={this.state.trackFilters}
											tracks={this.state.tracks}
											feedInstance={displayPage => this.feedInstance(displayPage)}
											tracksWithPosition={() => this.tracksWithPosition()}
										/>
									)}
								/>

								<Route
									path="/curators"
									render={() => (
										<Curators
											fetchCurators={() => this.fetchCurators()}
											loading={this.state.loading}
											curators={this.state.curators}
										/>
									)}
								/>
								<Route path="/submit" component={Submit} />
								<Route
									path="/soundcloud_users/:id"
									render={props => {
										const allProps = {
											...props,
											soundcloudUser: this.state.soundcloudUser,
											loading: this.state.loading && this.state.loadingSoundcloudUser,
											fetchSoundcloudUser: id => this.fetchSoundcloudUser(id),
											feed: this.feedInstance('curator'),
											setUser: (id, only_mixes) => {
												if (only_mixes) {
													this.setFilters({
														soundcloud_user_id: id,
														date_range: -1,
														sort_type: 'latest',
														track_type: 2,
														page: 1
													});
												} else {
													this.setFilters({
														soundcloud_user_id: id,
														sort_type: 'hot',
														date_range: -1,
														track_type: -1,
														page: 1
													});
												}
											}
										};
										return <SoundcloudUser {...allProps} />;
									}}
								/>
								<Route path="/about" component={About} />
							</Sidebar.Pusher>
							<div className="App-separator" style={{ height: '70px' }} />
						</Sidebar.Pushable>

						<div
							className="App-bottom-nav-container"
							onClick={e => {
								if (!e.target.classList.contains('App-filters-toggle-icon')) {
									this.setState({ bottomMenuVisible: false });
								}
							}}
						>
							<div className="App-bottom-nav-track-info-container">
								{this.state.playingTrack.id ? (
									<Item>
										<a href={this.state.playingTrack.data.track.permalink_url} target="_blank">
											<Item.Image
												src={this.state.playingTrack.data.track.artwork_url}
												className="App-bottom-nav-track-image"
												size="tiny"
											/>
										</a>
										<Item.Content verticalAlign="middle" className="App-bottom-nav-track-content">
											<Item.Header className="App-bottom-nav-track-info-name">
												{this.state.playingTrack.data.track.name}
											</Item.Header>
											<Item.Meta>
												<span className="App-bottom-nav-track-info-publisher">
													<Link
														to={`/soundcloud_users/${this.state.playingTrack.data.publisher[0].id}`}
													>
														{this.state.playingTrack.data.publisher[0].name}
													</Link>
												</span>
											</Item.Meta>
										</Item.Content>
									</Item>
								) : null}
							</div>

							<div className="App-bottom-nav-play-button">
								<Icon
									name={this.state.playing ? 'pause circle' : 'video play'}
									size="huge"
									color="pink"
									className="App-filters-toggle-icon"
									onClick={() => {
										const { id } = this.state.playingTrack;
										if (id) {
											this.togglePlay(id);
										}
									}}
								/>
							</div>

							<div className="App-bottom-nav">
								<FiltersMenu
									visible={this.state.bottomMenuVisible}
									trackFilters={this.state.trackFilters}
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
				</ScrollToTop>
			</Router>
		);
	}
}

export default App;
