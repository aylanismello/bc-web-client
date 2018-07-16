import React, { Component } from 'react';
import { Container, Sidebar, Message } from 'semantic-ui-react';
import { HashRouter as Router, Route } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import SoundCloudAudio from 'soundcloud-audio';
import Feed from '../Feed';
import { baseUrl } from '../config';
import SideMenu from '../SideMenu';
import FeedHome from '../FeedHome';
import Home from '../Home';
import Track from '../Track';
import Mixes from '../Mixes';
import About from '../About';
import Submit from '../Submit';
import Curators from '../Curators';
import SoundcloudUser from '../SoundcloudUser';
import TopNav from '../TopNav';
import SuperFilterPanel from '../Feed/SuperFilterPanel';
import BottomNav from '../BottomNav';
import TrackList from '../TrackList';
import ScrollToTop from '../scroll_to_top';
import { homeFilters } from '../filter_helpers';
import './App.css';

const queryString = require('query-string');

class App extends Component {
	static formatFilters(trackFilters) {
		const { location_ids, track_tag_ids, mix_names } = trackFilters;

		if (location_ids) {
			return { ...trackFilters, location_ids: JSON.stringify(location_ids) };
		} else if (track_tag_ids) {
			return { ...trackFilters, track_tag_ids: JSON.stringify(track_tag_ids) };
		} else if (mix_names) {
			return { ...trackFilters, mix_names: JSON.stringify(mix_names) };
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
		playingTrackFilters: {},
		soundcloudUserFilters: {},
		playing: false,
		query: '',
		playingTrackId: undefined,
		playingTrack: Object.freeze({
			id: undefined,
			data: {},
			url: window.location.href
		}),
		currentTrackGraphData: {},
		loadingCurrentTrackGraphData: false,
		selectedSuperFilterId: null,
		initPlayer: false,
		donePaginating: false,
		tracks: [],
		playingTracks: [],
		error: null,
		success: null,
		loading: false,
		loadingUpdatePlayCount: false,
		curators_next_href: '',
		unsplashPhoto: null,
		sideMenuVisible: false,
		bottomMenuVisible: false,
		showFullSearchBar: false,
		superFilters: [],
		curators: [],
		soundcloudUser: {},
		loadingSoundcloudUser: false,
		loadingSuperfilter: false,
		playFirstNewTrackOnLoad: false
	});

	componentWillMount() {
		this.scAudio = new SoundCloudAudio('caf73ef1e709f839664ab82bef40fa96');
		this.fetchCurators();
		window.scAudio = this.scAudio;
	}

	componentWillUpdate(nextProps, nextState) {
		if (!this.state.error && nextState.error) {
			window.amplitude.getInstance().logEvent('Auto - Error', {
				error: nextState.error
			});
		}

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

			this.fetchTracks(
				nextState.trackFilters,
				paginate,
				nextState.playFirstNewTrackOnLoad
			);
		}

		// THIS IS FOR WHEN WE ARE LOADING MORE TRACKS ON AN ALREADY PLAYING FEED AUTOMATICALLY

		if (!this.state.superFilters.length && nextState.superFilters.length) {
			this.setSuperfilter(
				nextState.superFilters.filter(sf => sf.position === 0)[0]
			);
		} else if (
			this.state.selectedSuperFilterId !== nextState.selectedSuperFilterId
		) {
			// this.setSuperfilter(nextState.superFilters.filter(sf => sf.id === nextState.selectedSuperFilterId))[0];
		}

		if (
			(!this.state.playing && nextState.playing) ||
			!_.isEqual(nextState.playingTracks, this.state.playingTracks) ||
			(this.state.playing &&
				nextState.playing &&
				nextState.playingTrack.id !== this.state.playingTrack.id)
		) {
			// remove all old event listeners from this.scAudio object
			this.scAudio.unbindAll();

			this.scAudio.play({
				streamUrl: this.getTrackById(
					nextState.playingTrack.id,
					nextState.playingTracks
				).stream_url
			});

			this.setSCAudioEndCB(nextState.playingTrack.id);
		}
	}

	setSCAudioEndCB(id) {
		this.scAudio.on('ended', () => {
			// TODO there's
			const { playingTracks } = this.state;
			// if we're viewing a single track, just pause
			const newSongIdx =
				playingTracks.findIndex(track => {
					return track.track.id === this.state.playingTrack.id;
				}) + 1;

			if (playingTracks.length === 1) {
				this.togglePlay(id);
				window.amplitude.getInstance().logEvent('Auto - Pause Single Track', {
					trackId: id
				});
			} else if (newSongIdx > playingTracks.length - 1) {
				// TODO: to logic to play once new tracks load.
				// this should be a general reusable function
				window.amplitude.getInstance().logEvent('Auto - Paginate', {
					page: (this.state.trackFilters.page || 0) + 1
				});

				this.paginate(true);
			} else {
				this.togglePlay(playingTracks[newSongIdx].track.id, true);
				window.amplitude.getInstance().logEvent('Auto - Play Next Track', {
					trackId: playingTracks[newSongIdx].track.id,
					trackName: playingTracks[newSongIdx].track.name,
					idx: newSongIdx,
					page: this.state.trackFilters.page
				});
			}
		});
	}

	getSuperFilterById(id) {
		return this.state.superFilters.filter(sf => sf.id === parseInt(id))[0];
	}
	setSuperfilterById(id, backToSameFilter) {
		const yo = this.state.superFilters.filter(sf => sf.id === parseInt(id))[0];
		this.setSuperfilter(yo, backToSameFilter);
	}

	setSuperfilter(selectedSuperFilter, backToSameFilter) {
		if (
			this.state.selectedSuperFilterId === selectedSuperFilter.id &&
			!backToSameFilter
		) {
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

	getTrackById(trackId, playingTracks = this.state.playingTracks) {
		return playingTracks.filter(({ track }) => {
			return track.id === trackId;
		})[0].track;
	}

	fetchCurrentTrackGraphdata(trackId) {
		this.setState({ loadingCurrentTrackGraphData: true });

		axios
			.get(`${baseUrl}/plays/${trackId}`)
			.then(results => {
				this.setState({
					currentTrackGraphData: results.data.data.plays,
					loadingCurrentTrackGraphData: false
				});
			})
			.catch(error => {
				this.setState({ loadingCurrentTrackGraphData: false });
			});
	}

	updateTrackPlay(id) {
		if (this.state.loadingUpdatePlayCount) {
			console.log('cant do shit, waiting');
			return;
		}

		this.setState({ loadingUpdatePlayCount: true });

		axios
			.post(`${baseUrl}/tracks/play`, { id })
			.then(results => {
				this.setState({ loadingUpdatePlayCount: false });
			})
			.catch(error => {
				this.setState({ error: error.message, loadingUpdatePlayCount: false });
			});
	}

	togglePlay(daTrackID, goingToNextPreloadedTracks = false) {
		// const daTrackID = trackId;
		// first track played this session

		if (!this.state.playingTrack.id && !this.state.loading) {
			this.setState({
				playingTracks: [...this.state.tracks],
				playing: true,
				playingTrackFilters: this.state.trackFilters
			});
			this.updateTrackPlay(daTrackID);
		} else if (this.state.playing && this.state.playingTrack.id === daTrackID) {
			this.scAudio.pause();
			this.setState({
				playing: !this.state.playing
			});
		} else if (this.state.playing && this.state.playingTrack.id !== daTrackID) {
			// we might be going to the next track while in a different page

			// PLAYING TRACK FOR FIRST TIME.
			// SET playingTracks!

			this.scAudio.pause();
			this.updateTrackPlay(daTrackID);

			if (!goingToNextPreloadedTracks) {
				this.setState({
					playingTracks: [...this.state.tracks],
					playingTrackFilters: this.state.trackFilters
				});
			}
		} else if (
			!this.state.playing &&
			this.state.playingTrack.id === daTrackID
		) {
			this.scAudio.play({
				streamUrl: this.getTrackById(daTrackID).stream_url
			});
			this.setState({
				playing: !this.state.playing
			});
		} else {
			// PLAYING TRACK FOR FIRST TIME.
			// SET playingTracks!
			this.updateTrackPlay(daTrackID);

			this.setState({
				playing: !this.state.playing,
				playingTracks: [...this.state.tracks],
				playingTrackFilters: this.state.trackFilters
			});
		}

		const sourceTracks = goingToNextPreloadedTracks
			? this.state.playingTracks
			: this.state.tracks;

		if (this.state.playingTrack.id !== daTrackID && !this.state.loading) {
			this.setState({
				playingTrack: {
					...this.state.playingTrack,
					id: daTrackID,
					data: sourceTracks.find(x => x.track.id === daTrackID),
					url: window.location.href
				},
				initPlayer: true
			});
		}
	}

	fetchTracks(trackFilters, paginate = false, playFirstNewTrackOnLoad = false) {
		this.setState({ loading: true });

		axios
			.get(`${baseUrl}/tracks`, { params: App.formatFilters(trackFilters) })
			.then(results => {
				if (paginate && !trackFilters.track_id) {
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

				if (playFirstNewTrackOnLoad) {
					// this IS buggy af.
					// TODO add page size to api results

					const newTrackIdx = (trackFilters.page - 1) * 10;
					this.togglePlay(this.state.tracks[newTrackIdx].track.id);
					this.setState({
						playFirstNewTrackOnLoad: false
					});
				}

				// we don't paginate a single track!
				if (!this.state.donePaginating && !trackFilters.track_id) {
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
				if (results.data.data.tracks && !results.data.data.tracks.length) {
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

	renderSuperFilterPanel(superFilterType, superfilterId) {
		let superFilters;

		const needToLoadSuperFilter = !this.state.superFilters.filter(
			superfilter => superfilter.superfilter_type === superFilterType
		).length;

		if (needToLoadSuperFilter && !this.state.loadingSuperfilter) {
			this.fetchSuperfilters(superFilterType);
		}

		return (
			<SuperFilterPanel
				superFilters={this.state.superFilters.filter(superfilter => {
					return superfilter.superfilter_type === superFilterType;
				})}
				key={superfilterId}
				setSuperfilter={selectedSuperFilter =>
					this.setSuperfilter(selectedSuperFilter)}
				selectedSuperFilterId={this.state.selectedSuperFilterId}
				loading={this.state.loadingSuperfilter}
				setSuperfilterById={id => this.setSuperfilterById(id)}
				superfilterId={superfilterId}
			/>
		);
	}

	paginate(playFirstNewTrackOnLoad = false) {
		if (!this.state.donePaginating && !playFirstNewTrackOnLoad) {
			this.setState({
				trackFilters: {
					...this.state.trackFilters,
					page: this.state.trackFilters.page + 1
				}
			});
		} else if (!this.state.donePaginating && playFirstNewTrackOnLoad) {
			// THHIS IS TO PAGINATE then play
			if (_.isEqual(this.state.playingTrackFilters, this.state.trackFilters)) {
				this.setState({
					trackFilters: {
						...this.state.trackFilters,
						page: this.state.trackFilters.page + 1
					},
					playFirstNewTrackOnLoad
				});
				// alert('u are play paginating from the same page, easy af');
			} else {
				// alert('u are play paginating from a diff page, hard af');
				this.togglePlay(this.state.playingTrack.id);
			}
		}
	}

	feedInstance(displayPage = 'home', feedType, superfilterId) {
		const selectedSuperFilter = this.getSuperFilterById(superfilterId);

		return (
			<Feed
				tracks={this.state.tracks}
				feedType={feedType}
				displayPage={displayPage}
				playing={this.state.playing}
				loading={this.state.loading}
				donePaginating={this.state.donePaginating}
				trackFilters={this.state.trackFilters}
				selectedSuperFilter={selectedSuperFilter}
				setTrackFilters={filters => this.setTrackFilters(filters)}
				setIsSubmission={isSubmission => this.setIsSubmission(isSubmission)}
				paginate={() => this.paginate()}
				playingTrackId={this.state.playingTrack.id}
				togglePlay={trackId => this.togglePlay(trackId)}
			>
				{feedType && this.renderSuperFilterPanel(feedType, superfilterId)}
			</Feed>
		);
	}

	renderTrackListWidget() {
		return (
			<TrackList
				isWidget
				tracks={this.state.tracks}
				playing={this.state.playing}
				loading={this.state.loading}
				donePaginating={this.state.donePaginating}
				trackFilters={this.state.trackFilters}
				setTrackFilters={filters => this.setTrackFilters(filters)}
				setIsSubmission={isSubmission => this.setIsSubmission(isSubmission)}
				playingTrackId={this.state.playingTrack.id}
				togglePlay={trackId => this.togglePlay(trackId)}
				selectedSuperFilter={{ name: 'Trending' }}
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
	}

	fetchSoundcloudUser(id, onlyMixes) {
		// let's rethink this.

		if (onlyMixes) {
			this.setTrackFilters({
				soundcloud_user_id: id,
				sort_type: 'latest',
				track_type: 2,
				page: 1
			});
		} else {
			this.setTrackFilters({
				soundcloud_user_id: id,
				sort_type: 'hot',
				page: 1
			});
		}

		this.setState({ loadingSoundcloudUser: true });

		axios.get(`${baseUrl}/soundcloud_users/${id}`).then(results => {
			const {
				soundcloud_user,
				handles,
				location,
				associated_users
			} = results.data.data;

			this.setState({
				soundcloudUser: {
					soundcloud_user,
					handles,
					location,
					associated_users
				},
				loadingSoundcloudUser: false
			});
		});
	}

	toggleBottomMenu() {
		this.setState({ bottomMenuVisible: !this.state.bottomMenuVisible });
	}

	tracksWithPosition() {
		return this.state.tracks
			.filter(track => track.publisher[0].location)
			.map(track => {
				return {
					...track,
					publisher: {
						...track.publisher[0],
						position: [track.publisher[0].lng, track.publisher[0].lat]
					}
				};
			});
	}

	fetchSuperfilters(superfilterType) {
		const shouldFetchSuperfilter = () => {
			return !(
				this.state.superFilters.filter(
					sf => sf.superfilter_type === superfilterType
				).length ||
				this.state.loadingSuperfilter ||
				this.state.error
			);
		};

		if (shouldFetchSuperfilter()) {
			this.setState({ loadingSuperfilter: true });
			axios
				.get(`${baseUrl}/superfilters?superfilter_type=${superfilterType}`)
				.then(results => {
					const { length } = results.data.data.superfilters;
					if (length) {
						this.setState({
							superFilters: [
								...this.state.superFilters,
								...results.data.data.superfilters
							],
							loadingSuperfilter: false
						});
					} else {
						this.setState({
							superFilters: [
								...this.state.superFilters,
								{
									superfilter_type: superfilterType,
									name: 'No results. This should never happen.'
								}
							],
							error: 'Could not find super filter!',
							loadingSuperfilter: false
						});
					}
				});
		}
	}

	// this should happen is fetch curators page
	fetchCurators(paginate = false) {
		this.setState({
			loading: true
		});
		axios
			.get(
				paginate
					? this.state.curators_next_href
					: `${baseUrl}/soundcloud_users/curators`
			)
			.then(results => {
				if (paginate) {
					this.setState({
						curators: [
							...this.state.curators,
							...results.data.data.soundcloud_users
						],
						curators_next_href: results.data.metadata.next_href,
						loading: false
					});
				} else {
					// loading first page
					this.setState({
						curators: results.data.data.soundcloud_users,
						curators_next_href: results.data.metadata.next_href,
						loading: false
					});
				}
				// this.setState({
				// 	curators: results.data.data.soundcloud_users,
				// 	loading: false
				// });
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
								clickedOnMenuItem={menuItem => {
									window.amplitude
										.getInstance()
										.logEvent('Click on Menu Item', {
											menuItem
										});
									this.toggleSidebar({ clickedOutsideMenu: true });
								}}
							/>

							<Sidebar.Pusher
								onClick={() => this.toggleSidebar({ clickedOutsideMenu: true })}
								as={Container}
							>
								{this.state.error ? (
									<Message
										className="App-message"
										negative
										onDismiss={() => {
											this.setState({ error: null, success: null });
										}}
										header="Sorry, something went wrong!"
										content={this.state.error}
									/>
								) : null}

								{this.state.success ? (
									<Message
										positive
										className="App-message"
										onDismiss={() => {
											this.setState({ error: null, success: null });
										}}
										header="Sweetness, thy name is you"
										content={this.state.success}
									/>
								) : null}

								<Route
									exact
									path="/"
									render={() => (
										<Home
											playing={this.state.playing}
											curators={this.state.curators}
											setHomeTrendingFilter={trendingSuperFilter => {
												this.setSuperfilter(trendingSuperFilter, true);
											}}
											superFilters={this.state.superFilters}
											homePageTrack={
												this.state.tracks[0] && this.state.tracks[0].track
											}
											trackListWidget={this.renderTrackListWidget()}
											setError={error =>
												this.setState({ error, success: null })}
											tracks={this.state.tracks}
											setSuccess={success =>
												this.setState({ success, error: null })}
											initPlayer={this.state.initPlayer}
											playingTrack={this.state.playingTrack}
											togglePlay={filters => this.togglePlay(filters)}
											fetchSuperfilters={superfilterType =>
												this.fetchSuperfilters(superfilterType)}
											homePlayDisabled={this.state.tracks.length === 0}
										/>
									)}
								/>

								<Route
									exact
									path="/feed"
									render={({ match, location }) => (
										<FeedHome
											superfilter_type={match.params.superfilter_type}
											getHomeTracks={() => {
												if (this.state.selectedSuperFilterId) {
													this.setSuperfilterById(
														this.state.selectedSuperFilterId,
														true
													);
												}
											}}
											loading={this.state.loading}
											trackFilters={this.state.trackFilters}
											fetchSuperfilters={superfilterType =>
												this.fetchSuperfilters(superfilterType)}
											tracks={this.state.tracks}
											feedInstance={(displayPage, feedType) =>
												this.feedInstance(
													displayPage,
													feedType,
													// fuck this is hacky TODO: make this suck less
													queryString.parse(location.search).id || 1
												)}
											tracksWithPosition={() => this.tracksWithPosition()}
										/>
									)}
								/>

								<Route
									path="/feed/:superfilter_type"
									render={({ match, location }) => {
										return (
											<FeedHome
												superfilter_type={match.params.superfilter_type}
												getHomeTracks={() => {
													if (this.state.selectedSuperFilterId) {
														this.setSuperfilterById(
															this.state.selectedSuperFilterId,
															true
														);
													}
												}}
												loading={this.state.loading}
												trackFilters={this.state.trackFilters}
												fetchSuperfilters={superfilterType =>
													this.fetchSuperfilters(superfilterType)}
												tracks={this.state.tracks}
												feedInstance={(displayPage, feedType) =>
													this.feedInstance(
														displayPage,
														feedType,
														queryString.parse(location.search).id
													)}
												tracksWithPosition={() => this.tracksWithPosition()}
											/>
										);
									}}
								/>

								<Route
									path="/tracks/:id"
									render={({ match }) => (
										<Track
											match={match}
											graphData={this.state.currentTrackGraphData}
											feed={this.feedInstance()}
											track={this.state.tracks[0] && this.state.tracks[0].track}
											loading={this.state.loading}
											loadingCurrentTrackGraphData={
												this.state.loadingCurrentTrackGraphData
											}
											setTrack={id => {
												this.setTrackFilters({ track_id: id });
												this.fetchCurrentTrackGraphdata(id);
											}}
										/>
									)}
								/>

								<Route
									path="/mixes/"
									exact
									render={() => (
										<Mixes
											fetchMixes={() => {
												this.fetchSuperfilters('mix');
											}}
											mixes={this.state.superFilters}
											loading={this.state.loadingSuperfilter}
											selectMix={mix => {
												this.setSuperfilter(mix);
											}}
										/>
									)}
								/>

								{/*  how the fuck do these two become the same */}
								<Route
									path="/curators/"
									exact
									render={({ match }) => (
										<Curators
											view={match.params.view}
											fetchCurators={paginate => this.fetchCurators(paginate)}
											loading={this.state.loading}
											curators={this.state.curators}
										/>
									)}
								/>

								<Route
									path="/curators/:view"
									render={({ match }) => (
										<Curators
											view={match.params.view}
											fetchCurators={paginate => this.fetchCurators(paginate)}
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
											loading:
												this.state.loading && this.state.loadingSoundcloudUser,
											fetchSoundcloudUser: id => this.fetchSoundcloudUser(id),
											tracks: this.state.tracks,
											feed: this.feedInstance(),
											soundcloudUserId: this.state.trackFilters
												.soundcloud_user_id,
											// soundcloudUser: this.state.tracks[0] && this.state.tracks[0].publisher[0],
											soundcloudUser:
												Object.keys(this.state.soundcloudUser).length &&
												this.state.soundcloudUser,
											setUser: (id, onlyMixes = false) => {
												this.fetchSoundcloudUser(id, onlyMixes);
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
								setBottomMenuInvisible={() =>
									this.setState({ bottomMenuVisible: false })}
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
