import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import css from './PlayButton.scss';

const PlayButton = ({ playing, playingTrack, togglePlay, size, disabled }) => (
	<div className="PlayButton">
		<Icon
			name={playing ? 'pause circle' : 'video play'}
			size={size}
			color="pink"
			className="App-filters-toggle-icon"
			onClick={() => {
				const isHome = size === 'massive';

				if (!disabled) {
					if (isHome) {
						window.amplitude
							.getInstance()
							.logEvent('Home - Click on Giant Play', {
								clickedWhileLoading: false
							});
					} else {
						window.amplitude
							.getInstance()
							.logEvent('Track Player - Click on Play', { playing: !playing });
					}
					const { id } = playingTrack;
					togglePlay(id);
				} else {
					if (isHome) {
						window.amplitude
							.getInstance()
							.logEvent('Home - Click on Giant Play', {
								clickedWhileLoading: true
							});
					} else {
						window.amplitude
							.getInstance()
							.logEvent('Track Player - Click on Play', { playing });
					}
				}
			}}
		/>
	</div>
);

const { bool, objectOf, string, func } = PropTypes;

PlayButton.propTypes = {
	playing: bool.isRequired,
	playingTrack: objectOf(string).isRequired,
	togglePlay: func.isRequired,
	size: string,
	disabled: bool
};

PlayButton.defaultProps = {
	size: 'huge',
	disabled: false
};

export default PlayButton;
