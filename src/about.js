import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Segment, Header, Divider, Item } from 'semantic-ui-react';
import './about.css';

const About = () => (
	<Container className="About-container" fluid>
		<Segment>
			{' '}
			<Header as="h1"> About Burn Cartel </Header> <Divider />{' '}
			<p className="About-text-intro About-text">
				{' '}
				We’re a team of music lovers, producers, DJs, and dreamers that want to
				take music curation into the 21st century and build a worldwide
				community to share and grow different music styles and help them scale
				beyond regional scenes.
			</p>
			<p className="About-text">
				Our main labor of love building the Burn Cartel brand is{' '}
				<a href="http://soundcloud.com/burncartel" target="_">
					{' '}
					Burn Cartel Radio{' '}
				</a>
				{/* , all episode of which are found (here) [link] or on Soundcloud. */}
			</p>
			<Header as="h1"> Get in touch. </Header>
			<Divider />
			<p className="About-text">
				We’re always looking for people to join us in our mission, so if you're
				a designer, photographer, or blogger feel free to reach out at
				<a href="mailto:hello@burncartel.com"> hello@burncartel.com </a>. If
				you’re an artist looking for some promotion, click{' '}
				<Link to="/submit"> here </Link> to submit a track for Burn Cartel
				network consideration. If you're intersted in having your label
				featured, also email us ❤️
			</p>
			<Header as="h1"> The Squad. </Header>
			<Divider />
			<Item.Group>
				<Item>
					<Item.Image
						size="tiny"
						src="https://scontent-sjc3-1.xx.fbcdn.net/v/t31.0-8/17434845_10155143213244508_4510004353904684336_o.jpg?oh=b0a59720177e7211d84e638012f5d257&oe=5B23150A"
					/>
					<Item.Content verticalAlign="middle">
						{' '}
						<Item.Header> Aylan Mello </Item.Header>{' '}
					</Item.Content>
				</Item>

				<Item>
					<Item.Image
						size="tiny"
						src="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-9/10420331_312784102254726_5377166241594989491_n.jpg?oh=036bf6dbd1dda55b1635b53541efc3ec&oe=5B164C12"
					/>
					<Item.Content verticalAlign="middle">
						{' '}
						<Item.Header> Chase Ward </Item.Header>{' '}
					</Item.Content>
				</Item>
			</Item.Group>
		</Segment>
	</Container>
);

export default About;
