import React from 'react';
import { Segment, Tab, Container } from 'semantic-ui-react';
import './soundcloud_user.css';

let lastId;

class SoundcloudUser extends React.Component {
	state = {
		lastId: null
	}

	componentWillMount() {
		this.props.setUser(this.props.match.params.id);
		this.setState({lastId: this.props.match.params.id})
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.match.params.id != this.state.lastId) {
			this.props.setUser(this.props.match.params.id);
			this.setState({lastId: this.props.match.params.id})
		}
	}


	render() {
		let name, is_curator;
		if (this.props.soundcloudUser) {
			name = this.props.soundcloudUser.name;
			is_curator = this.props.soundcloudUser.is_curator;
		}

		return (
			<Container>
				<Segment>
					<h1>{name}</h1>
					<h2> Some stats here </h2>
					{is_curator && 'Is Curator'}
				</Segment>
				<Tab
					menu={{ secondary: true, pointing: true }}
					onTabChange={(e, data) => {
						if (data.activeIndex === 0) {
							this.props.setUser(this.props.match.params.id, false);
						} else {
							// is_mixes is true here
							this.props.setUser(this.props.match.params.id, true);
						}
					}}
					panes={[
						{
							menuItem: 'Tracks ⬆️',
							render: () => this.props.feed
						},
						{
							menuItem: 'Mixes 📡',
							render: () => this.props.feed
						}
					]}
				/>
			</Container>
		);
	}
}

export default SoundcloudUser;
