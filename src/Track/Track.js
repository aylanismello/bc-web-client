import React from 'react';
import { Segment, Container, Header, Image, Label } from 'semantic-ui-react';
import ReactChartkick, { LineChart, BarChart, PieChart, ColumnChart } from 'react-chartkick';
import Chart from 'chart.js';
import './Track.css';

ReactChartkick.addAdapter(Chart);

class Track extends React.Component {
	componentWillMount() {
		this.props.setTrack(this.props.match.params.id);
	}

	render() {
		const {
			feed, track, graphData, loadingCurrentTrackGraphData
		} = this.props;
		const messages = loadingCurrentTrackGraphData ? {} : { empty: 'No plays. Wanna be the first? :) ' };
		return (
			<Container>
				<Segment className="Track-banner-container">
					<div className="Track-banner-left-half">
						<Header as="h2">
							<Image circular src={track && track.artwork_url} /> {track && track.name}
						</Header>
						<Label
							color="pink"
							size="small"
							icon="headphone"
							content={track && track.playback_count_bc}
						/>
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
