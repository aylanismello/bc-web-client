import React from 'react';
import {
	Dimmer,
	Segment,
	Loader,
	Divider,
	Header,
	Card,
	Container,
	Image,
	Item,
	Tab,
	Label
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
	publisherLocationsToString
} from '../helpers';

class CuratorList extends React.Component {
	renderList(curators) {
		return (
			<Item.Group relaxed divided>
				{curators.map((curator, idx) => {
					return (
						<Item key={curator.id}>
							<div className="Curators-curator-list-item">
								<Link to={`/soundcloud_users/${curator.soundcloud_user.id}`}>
									{/* <Label color="teal">#{idx + 1}</Label> */}
									<Label as="a" basic>
										<Image
											avatar
											spaced="right"
											src={curator.soundcloud_user.avatar_url}
											style={{ border: '#df5353 solid 5px' }}
										/>
										{curator.soundcloud_user.name}
									</Label>
								</Link>
								<Label
									icon="globe"
									content={publisherLocationsToString({
										location: curator.location.name
									})}
								/>
							</div>
						</Item>
					);
				})}
			</Item.Group>
		);
	}

	renderGallery(curators) {
		return (
			<Card.Group>
				{curators.map(curator => {
					return (
						<Link to={`/soundcloud_users/${curator.soundcloud_user.id}`}>
							<Card.Content>
								<Image src={curator.soundcloud_user.avatar_url} size="tiny" />
							</Card.Content>
						</Link>
					);
				})}
			</Card.Group>
		);
	}

	render() {
		return (
			<div>
				{this.props.view === 'list'
					? this.renderList(this.props.curators)
					: this.renderGallery(this.props.curators)}
			</div>
		);
	}
}


export default CuratorList;
