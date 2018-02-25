import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import BCSearch from './bc_search';
import BCLogo from './bc_logo';

const { func } = propTypes;

class TopNav extends React.Component {
	propTypes = {
		toggleSidebar: func.isRequired,
		setFilter: func.isRequired
	};

	state = {
		showFullSearchBar: false
	};

	render() {
		return (
			<Segment
				className="App-top-nav"
				onClick={() => {
					this.props.toggleSidebar({ clickedOutsideMenu: true });
				}}
			>
				<Icon
					name="content"
					size="big"
					color="blue"
					className="App-sidebar-button"
					onClick={() => this.props.toggleSidebar()}
				/>

				<Link to="/" onClick={() => this.props.fetchHomeTracks()}>
					<BCLogo />
				</Link>

				<BCSearch
					showFullSearchBar={this.state.showFullSearchBar}
					setShowFullSearchBar={() => 5}
					setFilter={this.props.setFilter}
				/>
			</Segment>
		);
	}
}

export default TopNav;
