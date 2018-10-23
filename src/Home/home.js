import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as _ from 'lodash';
import {
	Container,
	Header,
	Segment,
	Icon,
	Divider,
	Form,
	Message,
	Button,
	Grid,
	Label
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BCMap from '../BCMap';
import { baseUrl } from '../config';
import PlayButton from '../PlayButton';
import CuratorList from '../CuratorList';
import './Home.scss';

class Home extends React.Component {
	state = {
		loadingEmail: false,
		email: ''
	};

	componentWillMount() {
		this.props.fetchSuperfilters('custom');

		const trendingSuperFilter = this.props.superFilters.filter(
			sf => sf.name === 'Trending'
		)[0];

		if (trendingSuperFilter) {
			this.props.setHomeTrendingFilter(trendingSuperFilter);
		}
	}

	renderBurnCartelGreeting() {
		const { playingTrack } = this.props;
		const iconSize = 'big';
		return (
			<div className="Home-BC-greeting-container">
				<Segment>
					[ You're listening to {playingTrack.data.track.name} by{' '}
					<Link to={`/soundcloud_users/${playingTrack.data.publisher[0].id}`}>
						{playingTrack.data.publisher[0].name}
					</Link>. ]
					<br />
					It's been selected by {playingTrack.data.curators.length}{' '}
					<Link to="/curators">curators</Link> in the last week
					{/* {this.props.playingTrack.data.track.created_at_external} */}
				</Segment>
				<Segment>
					<div className="Home-BC-description">
						We make{' '}
						<Link
							to="/feed"
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('Home - Click on Banner CTO ', {
										itemClicked: 'feed'
									});
							}}
						>
							{' '}
							Feed{' '}
						</Link>, BC Radio, and{' '}
						<Link
							to="/about"
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('Home - Click on Banner CTO ', {
										itemClicked: 'about'
									});
							}}
						>
							{' '}
							more{' '}
						</Link>.
					</div>
					<div className="Home-social-links">
						<a
							href="https://soundcloud.com/burncartel"
							target="_blank"
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('Home - Click on Banner CTO ', {
										itemClicked: 'soundcloud'
									});
							}}
						>
							<Icon link size={iconSize} name="soundcloud" color="pink" />
						</a>
						<a
							href="https://instagram.com/burncartel"
							target="_blank"
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('Home - Click on Banner CTO ', {
										itemClicked: 'instagram'
									});
							}}
						>
							<Icon link size={iconSize} name="instagram" color="pink" />
						</a>
						<a
							href="https://twitter.com/burncartel"
							target="_blank"
							onClick={() => {
								window.amplitude
									.getInstance()
									.logEvent('Home - Click on Banner CTO ', {
										itemClicked: 'twitter'
									});
							}}
						>
							<Icon link size={iconSize} name="twitter" color="pink" />
						</a>
					</div>
					<Form
						onSubmit={() => {
							this.setState({ loadingEmail: true });

							axios
								.post(`${baseUrl}/emails`, { email: this.state.email })
								.then(results => {
									this.setState({ loadingEmail: false });
									const { error, data } = results.data;
									if (error.message && Object.keys(error.message).length) {
										if (error.message.errors && error.message.errors.length) {
											this.props.setError('Invaild email');
										} else {
											this.props.setError(error.message.name);
										}
									} else if (data) {
										this.props.setSuccess(
											'Successfully added your info to our DB!'
										);
										this.setState({ email: '' });
									}
								});
						}}
					>
						<Form.Field inline>
							{/* <Label pointing="right">Stay in touch?</Label> */}
							<input
								value={this.state.email}
								onChange={e => this.setState({ email: e.currentTarget.value })}
								type="text"
								placeholder="stay up to date 🚀"
								onClick={() => {
									window.amplitude
										.getInstance()
										.logEvent('Home - Click on Banner CTO ', {
											itemClicked: 'emailField'
										});
								}}
							/>
							<Button
								type="submit"
								disabled={this.state.loadingEmail || !this.state.email.trim()}
								loading={this.state.loadingEmail}
							>
								Submit
							</Button>
						</Form.Field>
					</Form>
				</Segment>
			</div>
		);
	}

	render() {
		const mobile = true;
		const {
			playingTrack,
			togglePlay,
			playing,
			homePlayDisabled,
			initPlayer,
			homePageTrack,
			superFilters
		} = this.props;

		return (
			<Container>
				<Segment
					inverted
					textAlign="center"
					style={{ minHeight: 350, padding: '1em 0em' }}
					vertical
				>
					<Container text>
						{initPlayer || (
							<div className="Home-BC-greeting-container">
								<Header
									as="h1"
									// content="Welcome to Burn Cartel"
									content="We organize the world's underground music."
									inverted
									style={{
										fontSize: mobile ? '2em' : '4em',
										fontWeight: 'normal',
										marginBottom: 0
										// marginTop: mobile ? '1.5em' : '3em'
									}}
								/>

								<Header
									as="h2"
									content={homePlayDisabled ? 'LOADING...' : '(take a listen)'}
									// content={homePlayDisabled ? 'LOADING...' : 'only fire trax'}
									inverted
									style={{
										fontSize: mobile ? '1.5em' : '1.7em',
										fontWeight: 'normal',
										marginTop: mobile ? '0.5em' : '1.5em'
									}}
								/>
							</div>
						)}
						{initPlayer ? (
							this.renderBurnCartelGreeting()
						) : (
							<PlayButton
								size="massive"
								playingTrack={
									(playingTrack.id && playingTrack) || homePageTrack
								}
								togglePlay={togglePlay}
								playing={playing}
								disabled={homePlayDisabled}
							/>
						)}
					</Container>
				</Segment>

				<div className="Home-widget-container">
					<Grid stackable columns={2}>
						<Grid.Column className="Home-widget">
							<Segment>
								<div className="Home-widget-header-container">
									<h3 className="Home-widget-header">Trending releases</h3>
									<h4 className="Home-widget-sub-header"> More releases </h4>
								</div>
								<Divider />
								{this.props.trackListWidget}
								<Header as="h3">
									More on{' '}
									<Link
										to="/feed"
										onClick={() => {
											window.amplitude
												.getInstance()
												.logEvent('Home - Click on Expand Widget', {
													widget: 'feed'
												});
										}}
									>
										{' '}
										Feed{' '}
									</Link>
								</Header>
							</Segment>
						</Grid.Column>
						<Grid.Column className="Home-widget">
							<Segment>
							<div className="Home-widget-header-container">
								<h3 className="Home-widget-header">Trending curators</h3>
								<h4 className="Home-widget-sub-header"> More curators </h4>
							</div>
								<Divider />
								<BCMap
									featureType="soundcloudUser"
									size={80}
									data={this.props.curators}
								/>
								<Header as="h3">
									More on{' '}
									<Link
										to="/curators"
										onClick={() => {
											window.amplitude
												.getInstance()
												.logEvent('Home - Click on Expand Widget', {
													widget: 'curators'
												});
										}}
									>
										{' '}
										our Curators page{' '}
									</Link>
								</Header>
								{/* <Divider /> */}
								{/* <CuratorList curators={this.props.curators} view="list" /> */}
							</Segment>
						</Grid.Column>
					</Grid>
				</div>
			</Container>
		);
	}
}

Home.propTypes = {
	setError: PropTypes.func.isRequired
};

export default Home;
