import React from 'react';
import { Segment, Container } from 'semantic-ui-react';
import './Track.css';

class Track extends React.Component {
	componentWillMount() {
		this.props.setTrack(this.props.match.params.id);
	}

	render() {
		return (
			<Container>
				<Segment>
					<h1> Track Info </h1>
				</Segment>
				{this.props.feed}
			</Container>
		);
	}
}

export default Track;
