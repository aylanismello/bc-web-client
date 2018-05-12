import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import css from './PlayButton.css';

const PlayButton = ({ playing, playingTrack, togglePlay, size }) => (
	<div className="PlayButton">
		<Icon
			name={playing ? 'pause circle' : 'video play'}
			size={size}
			color="pink"
			className="App-filters-toggle-icon"
			onClick={() => {
				const { id } = playingTrack;
				togglePlay(id);
			}}
		/>
	</div>
);
const { bool, objectOf, string, func } = PropTypes;


PlayButton.propTypes = {
	playing: bool.isRequired,
	playingTrack: objectOf(string).isRequired,
	togglePlay: func.isRequired,
	size: string
};

PlayButton.defaultProps = {
	size: 'huge'
};

export default PlayButton;
