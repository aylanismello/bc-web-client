import React from 'react';
import {
	Input,
	Container,
	Segment,
	Header,
	Divider,
	Step,
	Icon,
	Button
} from 'semantic-ui-react';
import axios from 'axios';
import BCLogo from './bc_logo';
import { baseUrl } from './config';
const url = `${baseUrl}/submissions`;

class Submit extends React.Component {
	state = {
		permalinkUrl: ''
	};

	submitTrack() {
		axios
			.post(url, {
				type: 'track',
				permalink_url: this.state.permalinkUrl
			})
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				debugger;
				// this.props.setError(error.error.message);
			});
	}

	render() {
		return (
			<Container>
				<Segment>
					<Header as="h1"> Submit a song </Header>
					<Divider />

					<Header as="h3"> The process </Header>

					<Step.Group>
						<Step active>
							<Icon name="soundcloud" />
							<Step.Content>
								<Step.Title>Submit Track</Step.Title>
								<Step.Description>
									Include link to soundcloud track.
								</Step.Description>
							</Step.Content>
						</Step>

						<Step>
							<Icon name="line chart" />
							<Step.Content>
								<Step.Title>Voting</Step.Title>
								<Step.Description>
									Watch stats on the <a href="/"> submission board </a>.
								</Step.Description>
							</Step.Content>
						</Step>

						<Step disabled>
							<BCLogo />
							<Step.Content>
								<Step.Title>Burn Cartel Promo</Step.Title>
								<Step.Description>Featured on BC Radio.</Step.Description>
							</Step.Content>
						</Step>
					</Step.Group>

					<p>
						{' '}
						Please note that for now only valid soundcloud URLs are allowed.{' '}
					</p>
					<Container>
						<Input
							placeholder="https://soundcloud.com/burncartel/...."
							value={this.state.permalinkUrl}
							onChange={e =>
								this.setState({ permalinkUrl: e.currentTarget.value })}
						/>
						<Button
							onClick={() => this.submitTrack()}
							disabled={!this.state.permalinkUrl.trim()}
							primary
						>
							Submit
						</Button>
					</Container>
				</Segment>
			</Container>
		);
	}
}

export default Submit;
