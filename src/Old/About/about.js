import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Segment, Header, Divider, Item } from 'semantic-ui-react';
import './about.scss';

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
				<a href="mailto:hello@burncartel.com"> hello@burncartel.com </a>.
				 {/* If
				you’re an artist looking for some promotion, click{' '}
				<Link to="/submit"> here </Link> to submit a track for Burn Cartel
				network consideration.  */}

				If you're intersted in having your label
				featured, also email us ❤️
			</p>
			<Header as="h1"> The Squad. </Header>
			<Divider />
			<Item.Group>
				<Item>
					<Item.Image
						size="tiny"
						src="https://scontent.feoh3-1.fna.fbcdn.net/v/t31.0-8/19477635_699812833552188_8986783639530590121_o.jpg?_nc_cat=0&oh=f5919b2f8d858c0631075796d8673dfa&oe=5BDC487F"
					/>
					<Item.Content verticalAlign="middle">
						{' '}
						<Item.Header> Aylan Mello </Item.Header>{' '}
					</Item.Content>
				</Item>

				<Item>
					<Item.Image
						size="tiny"
						src="https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-9/10420331_312784102254726_5377166241594989491_n.jpg?_nc_cat=0&oh=dbdc41108e2a47c56ffec17100508af5&oe=5BDC0D12"
					/>
					<Item.Content verticalAlign="middle">
						{' '}
						<Item.Header> Chase Ward </Item.Header>{' '}
					</Item.Content>
				</Item>

				<Item>
					<Item.Image
						size="tiny"
						src="https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-9/14364665_10153838944836828_8262998510335962003_n.jpg?_nc_cat=0&oh=9818cf77ee8d0b055c8c75c5419c7418&oe=5BE2BE88"
					/>
					<Item.Content verticalAlign="middle">
						{' '}
						<Item.Header> Alex Nisnevich </Item.Header>{' '}
					</Item.Content>
				</Item>

				<Item>
					<Item.Image
						size="tiny"
						src="https://scontent.feoh3-1.fna.fbcdn.net/v/t1.0-0/p206x206/149378_10205352125337311_4002685165011256733_n.jpg?_nc_cat=0&oh=f851d44bd72eef008b63d3dd56818715&oe=5BDEFC15"
					/>
					<Item.Content verticalAlign="middle">
						{' '}
						<Item.Header> Raymond Hui </Item.Header>{' '}
					</Item.Content>
				</Item>
			</Item.Group>
		</Segment>
	</Container>
);

export default About;
