import React from 'react';
import { Dimmer, Loader, Segment, Header } from 'semantic-ui-react';

import './TabbedSegment.css';

const TabbedSegment = ({ loading, children, firstRequestMade }) => {
	return (
		<Dimmer.Dimmable as={Segment} dimmed={loading}>
			<Dimmer active={loading} inverted>
				<Loader> Loading </Loader>
			</Dimmer>
			{(children.props.tracks && children.props.tracks.length > 0) ||
			(children.props.users && children.props.users.length > 0) ||
			(children.props.locations && children.props.locations.length > 0) ||
			!firstRequestMade ? (
				children
			) : (
				<div className="TabbedSegment-Error-Container">
					{' '}
					<Header as="h1"> Sorry to stop the 🎧! No results found 🤧 </Header>
					<div
						className="TabbedSegment-Error-Gif"
						onClick={() => (window.location = 'google.com')}
					>
						<iframe
							src="https://giphy.com/embed/xT9IgKGRbWmPsUqk36"
							width="100%"
							height="100%"
							frameBorder="0"
							allowFullScreen
						/>
					</div>
				</div>
			)}
		</Dimmer.Dimmable>
	);
};

export default TabbedSegment;
