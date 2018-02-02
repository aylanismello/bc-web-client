import React from 'react';
import {
	Input,
	Container,
	Segment,
	Header,
	Divider,
	Step,
	Icon,
	Button,
	Message,
	Form
} from 'semantic-ui-react';
import axios from 'axios';
import BCLogo from './bc_logo';
import { baseUrl } from './config';
import './submit.css';

const url = `${baseUrl}/submissions`;

class Submit extends React.Component {
	state = {
		permalinkUrl: '',
		error: '',
		success: '',
		loading: false
	};

	submitTrack() {
		this.setState({ loading: true });
		axios
			.post(url, {
				permalink_url: this.state.permalinkUrl
			})
			.then(({ data }) => {
				if (Object.keys(data.error).length > 0) {
					this.setState({ error: data.error.message });
				} else {
					// this.setState({ success: data.metadata.message });
					this.setState({
						success: `Succesfully submitted ${this.state
							.permalinkUrl}! Keep you eye on the submissions board!`
					});
				}
			})
			.catch(error => {
				this.setState({ error: error.message });
				// API is not sending error codes + json properly
			})
			.finally(() => {
				this.setState({ loading: false });
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

					<p> Only valid soundcloud URLs are allowed. </p>
					<Form>
						<Form.Field>
							<Input
								placeholder="https://soundcloud.com/burncartel/...."
								value={this.state.permalinkUrl}
								fluid
								onChange={e =>
									this.setState({ permalinkUrl: e.currentTarget.value })}
							/>
						</Form.Field>
						<Button
							type="submit"
							onClick={() => this.submitTrack()}
							disabled={!this.state.permalinkUrl.trim()}
							loading={this.state.loading}
							primary
						>
							Submit
						</Button>
					</Form>

					{this.state.error ? (
						<Message
							className="Submit-error-message"
							negative
							onDismiss={() => {
								this.setState({ error: null });
							}}
							header="Just a sec -"
							content={this.state.error}
						/>
					) : null}

					{this.state.success ? (
						<Message
							className="Submit-success-message"
							positive
							onDismiss={() => {
								this.setState({ success: null });
							}}
							header="Nice."
							content={this.state.success}
						/>
					) : null}
				</Segment>
			</Container>
		);
	}
}

export default Submit;
