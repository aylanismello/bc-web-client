import React from 'react';
import {
	Segment,
	Container,
	Header,
	Image,
	Label,
	Icon
} from 'semantic-ui-react';
import ReactChartkick, { LineChart } from 'react-chartkick';
import Chart from 'chart.js';
import './Track.css';

ReactChartkick.addAdapter(Chart);

class Track extends React.Component {
	state = {
		lastId: null
	};

	componentWillMount() {
		this.props.setTrack(this.props.match.params.id);
		this.setState({ lastId: this.props.match.params.id });
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.match.params.id != this.state.lastId) {
			this.props.setTrack(this.props.match.params.id);
			this.setState({ lastId: this.props.match.params.id });
		}
	}

	render() {
		const { feed, track, graphData, loadingCurrentTrackGraphData } = this.props;
		const messages = loadingCurrentTrackGraphData
			? {}
			: { empty: 'No plays. Wanna be the first? :) ' };
		return (
			<Container>
				<Segment className="Track-banner-container">
					<div className="Track-banner-left-half">
						<Header as="h2">
							<Image circular src={track && track.artwork_url} />{' '}
							{track && track.name}
						</Header>
						<div className="Track-banner-main-icons">
							<Label
								color="pink"
								size="small"
								icon="headphone"
								content={track && track.playback_count_bc}
							/>
							<a
								href={track && track.permalink_url}
								target="blank"
								onClick={() => {
									window.amplitude
										.getInstance()
										.logEvent('Track - Click Soundcloud Link', {
											id: track.id,
											name: track.name,
											permalink_url: track.permalink_url
										});
								}}
							>
								<Icon link size="big" name="soundcloud" color="pink" />
							</a>
						</div>
					</div>
					<div className="Track-banner-right-half">
						<LineChart
							data={graphData}
							discrete
							width="300px"
							height="200px"
							label="Plays"
							messages={messages}
						/>
					</div>
				</Segment>
				{feed}
			</Container>
		);
	}
}

export default Track;
