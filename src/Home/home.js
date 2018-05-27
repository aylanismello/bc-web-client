import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PlayButton from '../PlayButton';
import { mainFilters } from '../filter_helpers';
import './Home.css';

class Home extends React.Component {
	componentWillMount() {
		this.props.setTrackFilters(mainFilters.Trending.filters);
	}

	renderBurnCartelGreeting() {
		const { playingTrack } = this.props;
		return (
			<div className="Home-BC-greeting-container">
				<Segment>
					[ You're listening to {playingTrack.data.track.name} by{' '}
					<Link to={`/soundcloud_users/${playingTrack.data.publisher[0].id}`}>
						{playingTrack.data.publisher[0].name}
					</Link>. ] It's been selected by {playingTrack.data.curators.length}{' '}
					curators in the last week
					{/* {this.props.playingTrack.data.track.created_at_external} */}
				</Segment>
				<Segment>
					<div className="Home-BC-description">
						We make <Link to="/feed"> Feed </Link>, BC Radio, and{' '}
						<Link to="/about"> more </Link>.
					</div>
					<div className="Home-social-links">
						<Icon link size="huge" name="soundcloud" color="pink" />
						<Icon link size="huge" name="instagram" color="pink" />
						<Icon link size="huge" name="youtube" color="pink" />
					</div>
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
			initPlayer
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
							playingTrack={playingTrack}
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
	setTrackFilters: PropTypes.func.isRequired
};

export default Home;
