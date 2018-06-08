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
import SuperFilterPanel from '../Feed/SuperFilterPanel';
import BottomNav from '../BottomNav';
import ScrollToTop from '../scroll_to_top';
import { homeFilters, mainFilters } from '../filter_helpers';
import './App.css';

class App extends Component {
	static formatFilters(trackFilters) {
		const { location_ids, track_tag_ids } = trackFilters

		if(location_ids) {
			return { ...trackFilters, location_ids: JSON.stringify(location_ids), };
		} else if(track_tag_ids) {
			return { ...trackFilters, track_tag_ids: JSON.stringify(track_tag_ids)};
		}

		return trackFilters;
	}

	constructor(props) {
		super(props);
		this.getTrackById = this.getTrackById.bind(this);
		this.renderSuperFilterPanel = this.renderSuperFilterPanel.bind(this);
	}

	state = Object.freeze({
		trackFilters: {},
		soundcloudUserFilters: {},
		playing: false,
		query: '',
		playingTrackId: undefined,
		playingTrack: Object.freeze({
			id: undefined,
			data: {}
		}),
		selectedSuperFilterId: null,
		initPlayer: false,
		donePaginating: false,
		tracks: [],
		playingTracks: [],
		error: null,
		loading: false,
		unsplashPhoto: null,
		sideMenuVisible: false,
		bottomMenuVisible: false,
		showFullSearchBar: false,
		superFilters: [],
		curators: [],
		soundcloudUser: {},
		loadingSoundcloudUser: false,
		loadingSuperfilter: false
	});

	componentWillMount() {
		this.scAudio = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
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

		if (!this.state.superFilters.length && nextState.superFilters.length) {
			this.setSuperfilter(nextState.superFilters[0]);
		} else if(this.state.selectedSuperFilterId !== nextState.selectedSuperFilterId) {
			// this.setSuperfilter(nextState.superFilters.filter(sf => sf.id === nextState.selectedSuperFilterId))[0];
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

	setSuperfilter(selectedSuperFilter) {
		if(this.state.selectedSuperFilterId === selectedSuperFilter.id) {
			return;
		}

		const {
			id,
			name,
			position,
			superfilter_type,
			image_url,
			description,
			created_at,
			updated_at,
			...formattedSuperfilters
		} = selectedSuperFilter;


		this.setState({
			selectedSuperFilterId: selectedSuperFilter.id,
			trackFilters: { ...formattedSuperfilters, page: 1 }
		});
	}

	fetchSuperfilters(superfilterType) {
		if (
			this.state.superFilters.filter(sf => sf.superfilter_type === superfilterType).length ||
			this.state.loadingSuperfilter
		) {
			console.log('no need to get this');
		} else {
			this.setState({ loadingSuperfilter: true });
			axios.get(`${baseUrl}/superfilters?superfilter_type=${superfilterType}`).then(results => {
				this.setState({
					superFilters: [...this.state.superFilters, ...results.data.data.superfilters],
					loadingSuperfilter: false
				});
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
			// need to find a better way to set htis
			// daTrackID = this.state.tracks[0].track.id;
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
				},
				initPlayer: true
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

	renderSuperFilterPanel(superFilterType) {
		let superFilters;

		const needToLoadSuperFilter = !this.state.superFilters.filter(superfilter => superfilter.superfilter_type === superFilterType).length;

		if (needToLoadSuperFilter && !this.state.loadingSuperfilter) {
			this.fetchSuperfilters(superFilterType);
		}

		return (
			<SuperFilterPanel
				superFilters={this.state.superFilters.filter(superfilter => superfilter.superfilter_type === superFilterType)}
				setSuperfilter={selectedSuperFilter => this.setSuperfilter(selectedSuperFilter)}
				selectedSuperFilterId={this.state.selectedSuperFilterId}
				loading={this.state.loadingSuperfilter}
			/>
		);
	}

	feedInstance(displayPage = 'home', feedType) {
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
			>
				{feedType && this.renderSuperFilterPanel(feedType)}
			</Feed>
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
											initPlayer={this.state.initPlayer}
											playingTrack={this.state.playingTrack}
											togglePlay={filters => this.togglePlay(filters)}
											fetchSuperfilters={superfilterType => this.fetchSuperfilters(superfilterType)}
											setTrackFilters={filters => this.setTrackFilters(filters)}
											homePlayDisabled={this.state.tracks.length === 0}
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
											fetchSuperfilters={superfilterType => this.fetchSuperfilters(superfilterType)}
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
											feed: this.feedInstance(),
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

						{this.state.initPlayer && (
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
						)}
					</div>
				</ScrollToTop>
			</Router>
		);
	}
}

export default App;
