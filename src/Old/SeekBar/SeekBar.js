import React from 'react';
import './SeekBar.scss';

// m.dotdev.co/how-to-build-an-audio-player-with-html5-and-the-progress-element-487cbbbaebfc

class SeekBar extends React.Component {
	componentDidMount() {
		const progress = document.getElementById('seek-obj');
		progress.addEventListener('click', event => {
			const { offsetWidth } = event.target;
			const { offsetX } = event;
			const percent = offsetX / offsetWidth;
			window.scAudio.setTime(percent * window.scAudio.audio.duration);
		});
	}

	render() {
		const { currentTime } = this.props;
		const value = currentTime / window.scAudio.audio.duration;
		return (
			<div className="audio-player">
				<div className="player-controls scrubber">
					<progress
						id="seek-obj"
						value={value}
						max="1"
					/>
				</div>
			</div>
		);
	}
}

export default SeekBar;
