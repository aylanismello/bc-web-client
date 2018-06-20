import React from 'react';
import { Segment, Container, Header, Image, Label } from 'semantic-ui-react';
import './Track.css';

class Track extends React.Component {
	componentWillMount() {
		this.props.setTrack(this.props.match.params.id);
	}

	render() {
		const { feed, track } = this.props;
		return (
			<Container>
				<Segment>
					<Header as="h2">
						<Image circular src={track && track.artwork_url} /> {track && track.name}
					</Header>
					<Label
						color="pink"
						size="small"
						icon="headphone"
						content={track && track.playback_count_bc}
					/>
				</Segment>
				{feed}
			</Container>
		);
	}
}

export default Track;
