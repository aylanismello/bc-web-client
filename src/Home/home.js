import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
	Container,
	Header,
	Segment,
	Icon,
	Form,
	Message,
	Button,
	Label
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { baseUrl } from '../config';
import PlayButton from '../PlayButton';
import './Home.css';

class Home extends React.Component {
	state = {
		loadingEmail: false,
		email: ''
	};

	componentWillMount() {
		this.props.fetchSuperfilters('custom');
	}

	renderBurnCartelGreeting() {
		const { playingTrack } = this.props;
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
						We make <Link to="/feed"> Feed </Link>, BC Radio, and{' '}
						<Link to="/about"> more </Link>.
					</div>
					<div className="Home-social-links">
						<a href="https://soundcloud.com/burncartel" target="_blank">
							<Icon link size="huge" name="soundcloud" color="pink" />
						</a>
						<a href="https://instagram.com/burncartel" target="_blank">
							<Icon link size="huge" name="instagram" color="pink" />
						</a>
						<a href="https://twitter.com/burncartel" target="_blank">
							<Icon link size="huge" name="twitter" color="pink" />
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
								placeholder="Email"
							/>
							<Button
								type="submit"
								disabled={this.state.loadingEmail}
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
			homePageTrack
		} = this.props;

		return (
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
								content="Welcome to Burn Cartel"
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
								content={homePlayDisabled ? 'LOADING...' : 'only fire trax'}
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
							playingTrack={(playingTrack.id && playingTrack) || homePageTrack}
							togglePlay={togglePlay}
							playing={playing}
							disabled={homePlayDisabled}
						/>
					)}
				</Container>
			</Segment>
		);
	}
}

Home.propTypes = {
	setError: PropTypes.func.isRequired
};

export default Home;
