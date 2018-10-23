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
import { publisherLocationsToString } from '../helpers';
import PaginateButton from '../PaginateButton';
import CuratorList from '../CuratorList';
import BCMap from '../BCMap';
import './Curators.scss';

class Curators extends React.Component {
	componentWillMount() {
		if (!this.props.curators.length) {
			this.props.fetchCurators();
		}
	}

	render() {
		const view = {
			list: 0,
			map: 1
		};

		return (
			<Container>
				<Tab
					menu={{ secondary: true, pointing: true }}
					activeIndex={parseInt(view[this.props.view] || 0, 10)}
					onTabChange={(e, data) => {
						const viewType = Object.keys(view)[parseInt(data.activeIndex, 10)];

						window.amplitude
							.getInstance()
							.logEvent('Change Curators View Tab', {
								tab: viewType
							});

						window.location = `/#curators/${viewType}`;
					}}
					panes={[
						{
							menuItem: 'List ⬆️',
							render: () => (
								<Segment>
									<Header as="h1"> Curators </Header>
									<Divider />
									<p className="About-text-intro About-text">
										{' '}
										Burn Cartel is powered by these collectives, labels, and
										radio shows. Hit us up if you want to see your curation up
										here. <Link to="/about"> More info here </Link>
									</p>
									<Divider />

									<Dimmer.Dimmable as={Segment} dimmed={this.props.loading}>
										<Dimmer active={this.props.loading} inverted>
											<Loader> Loading </Loader>
										</Dimmer>

										<CuratorList curators={this.props.curators} view="list" />
									</Dimmer.Dimmable>
									<PaginateButton
										loading={this.props.loading}
										donePaginating={false}
										paginate={() => this.props.fetchCurators(true)}
									/>
								</Segment>
							)
						},
						{
							menuItem: 'Map 🗺',
							render: () => (
								<BCMap
									featureType="soundcloudUser"
									size={100}
									data={this.props.curators}
									loading={this.props.loading}
								/>
							)
						}
					]}
				/>
			</Container>
		);
	}
}

export default Curators;
