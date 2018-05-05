import React from 'react';
import {
	Container,
	Header,
	Responsive,
	Segment,
	Button,
	Icon
} from 'semantic-ui-react';

const HomepageHeading = ({ mobile }) => (
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
		<Icon name={'video play'} size="massive" color="pink" />
	</Container>
);

const Home = props => {
	return (
		<Segment
			inverted
			textAlign="center"
			style={{ minHeight: 350, padding: '1em 0em' }}
			vertical
		>
			<HomepageHeading mobile />
		</Segment>
	);
};

export default Home;
