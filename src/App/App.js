import React, { Component } from 'react';
import { Container, Sidebar, Message, Icon, Item } from 'semantic-ui-react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import SoundCloudAudio from 'soundcloud-audio';
import Feed from '../Feed';
import { baseUrl } from '../config';
import SideMenu from '../SideMenu';
import FeedHome from '../FeedHome';
import Home from '../Home';
import About from '../About';
import Submit from '../Submit';
import Curators from '../Curators';
import SoundcloudUser from '../SoundcloudUser';
import TopNav from '../TopNav';
import BottomNav from '../BottomNav';
import ScrollToTop from '../scroll_to_top';
import { homeFilters } from '../filter_helpers';
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
		playingTracks: [],
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

		if (
			(!this.state.playing && nextState.playing) ||
			!_.isEqual(nextState.playingTracks, this.state.playingTracks) ||
			(this.state.playing &&
				nextState.playing &&
				nextState.playingTrack.id !== this.state.playingTrack.id)
		) {
			this.scAudio.play({
				streamUrl: this.getTrackById(nextState.playingTrack.id, nextState.playingTracks).stream_url
			});
		}
	}

	getTrackById(trackId, playingTracks = this.state.playingTracks) {
		return playingTracks.filter(({ track }) => {
			return track.id === trackId;
		})[0].track;
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
		let daTrackID = trackId;
		// first track played this session
		if (!this.state.playingTrack.id && !this.state.loading) {
			daTrackID = this.state.tracks[0].track.id;
			this.setState({
				playingTracks: [...this.state.tracks],
				playing: true
			});
		} else if (this.state.playing && this.state.playingTrack.id === daTrackID) {
			this.scAudio.pause();
			this.setState({
				playing: !this.state.playing
			});
		} else if (this.state.playing && this.state.playingTrack.id !== daTrackID) {
			// PLAYING TRACK FOR FIRST TIME.
			// SET playingTracks!

			this.scAudio.pause();

			this.setState({
				playingTracks: [...this.state.tracks]
			});
		} else if (!this.state.playing && this.state.playingTrack.id === daTrackID) {
			this.scAudio.play({
				streamUrl: this.getTrackById(daTrackID).stream_url
			});
			this.setState({
				playing: !this.state.playing
			});
		} else {
			// PLAYING TRACK FOR FIRST TIME.
			// SET playingTracks!

			this.setState({
				playing: !this.state.playing,
				playingTracks: [...this.state.tracks]
			});
		}

		if (this.state.playingTrack.id !== daTrackID && !this.state.loading) {
			this.setState({
				playingTrack: {
					...this.state.playingTrack,
					id: daTrackID,
					data: this.state.tracks.find(x => x.track.id === daTrackID)
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
					window.scrollTo(0, document.body.scrollHeight + 10000);
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

	setIsSubmission(isSubmission) {
		this.setState({
			trackFilters: {
				...this.state.trackFilters,
				page: 1,
				is_submission: isSubmission
			}
		});
	}

	feedInstance(displayPage = 'home', feedType = 'tracks') {
		return (
			<Feed
				tracks={this.state.tracks}
				feedType={feedType}
				displayPage={displayPage}
				playing={this.state.playing}
				loading={this.state.loading}
				donePaginating={this.state.donePaginating}
				trackFilters={this.state.trackFilters}
				setTrackFilters={filters => this.setTrackFilters(filters)}
				setIsSubmission={isSubmission => this.setIsSubmission(isSubmission)}
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

	// for fine grained filter changes
	updateSingleTrackFilters(filters) {
		this.setState({
			trackFilters: { ...this.state.trackFilters, ...filters }
		});
	}

	// this is used for updating super filters
	setTrackFilters(filters) {
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

	toggleBottomMenu() {
		this.setState({ bottomMenuVisible: !this.state.bottomMenuVisible });
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

	fetchHomeTracks() {
		this.setTrackFilters({
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
											playing={this.state.playing}
											playingTrack={this.state.playingTrack}
											togglePlay={filters => this.togglePlay(filters)}
											setTrackFilters={filters => this.setTrackFilters(filters)}
										/>
									)}
								/>

								<Route
									path="/feed"
									render={() => (
										<FeedHome
											getHomeTracks={() => this.fetchHomeTracks()}
											loading={this.state.loading}
											trackFilters={this.state.trackFilters}
											tracks={this.state.tracks}
											feedInstance={(displayPage, feedType) =>
												this.feedInstance(displayPage, feedType)}
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
													this.setTrackFilters({
														soundcloud_user_id: id,
														date_range: -1,
														sort_type: 'latest',
														track_type: 2,
														page: 1
													});
												} else {
													this.setTrackFilters({
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

						<BottomNav
							playing={this.state.playing}
							playingTrack={this.state.playingTrack}
							bottomMenuVisible={this.state.bottomMenuVisible}
							toggleBottomMenu={() => this.toggleBottomMenu()}
							setBottomMenuInvisible={() => this.setState({ bottomMenuVisible: false })}
							setTrackFilters={newFilters => {
								this.updateSingleTrackFilters(newFilters);
							}}
							togglePlay={id => this.togglePlay(id)}
							trackFilters={this.state.trackFilters}
						/>
					</div>
				</ScrollToTop>
			</Router>
		);
	}
}

export default App;
