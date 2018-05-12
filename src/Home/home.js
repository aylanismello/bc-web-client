import React from 'react';
import { Container, Header, Segment, Icon } from 'semantic-ui-react';
import PlayButton from '../PlayButton';
import PropTypes from 'prop-types';
import { mainFilters } from '../filter_helpers';

const HomepageHeading = ({ mobile, playingTrack, playing, togglePlay }) => (
	<Container text>
		<Header
			as="h1"
			content="Welcome to Burn Cartel"
			inverted
			style={{
				fontSize: mobile ? '2em' : '4em',
				fontWeight: 'normal',
				marginBottom: 0,
				marginTop: mobile ? '1.5em' : '3em'
			}}
		/>
		<Header
			as="h2"
			content="only fire trax"
			inverted
			style={{
				fontSize: mobile ? '1.5em' : '1.7em',
				fontWeight: 'normal',
				marginTop: mobile ? '0.5em' : '1.5em'
			}}
		/>
		<PlayButton
			size="massive"
			playingTrack={playingTrack}
			togglePlay={togglePlay}
			playing={playing}
		/>
		{/* <Icon name={'video play'} size="massive" color="pink" /> */}
	</Container>
);

class Home extends React.Component {
	componentWillMount() {
		this.props.setTrackFilters(mainFilters.Trending.filters);
	}

	render() {
		return (
			<Segment
				inverted
				textAlign="center"
				style={{ minHeight: 350, padding: '1em 0em' }}
				vertical
			>
				<HomepageHeading
					mobile
					playingTrack={this.props.playingTrack}
					playing={this.props.playing}
					togglePlay={this.props.togglePlay}
				/>
			</Segment>
		);
	}
}

Home.propTypes = {
	setTrackFilters: PropTypes.func.isRequired
};

export default Home;
