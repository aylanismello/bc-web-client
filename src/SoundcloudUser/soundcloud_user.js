import React from 'react';
import { Segment, Tab, Container } from 'semantic-ui-react';
import './soundcloud_user.css';

class SoundcloudUser extends React.Component {
	componentWillMount() {
		this.props.setUser(this.props.match.params.id);
	}

	render() {
		let name, is_curator;
		if (this.props.soundcloudUser) {
			name = this.props.soundcloudUser.name;
			is_curator = this.props.soundcloudUser.is_curator;
			// console.log(this.props.soundcloudUser);
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
