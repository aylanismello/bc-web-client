import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import SearchBar from '../SearchBar';
import './top_nav.css';
import BCLogo from '../BCLogo';

const { func } = propTypes;

class TopNav extends React.Component {
	static propTypes = {
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
				<div className="App-top-nav-side">
					<Icon
						name="content"
						size="big"
						color="blue"
						className="App-sidebar-button"
						onClick={() => this.props.toggleSidebar()}
					/>
				</div>

				<div className="App-top-nav-side">
					{/* <Link to="/" onClick={() => this.props.fetchHomeTracks()}> */}
					<Link to="/">
						<BCLogo />
					</Link>
				</div>

				<div className="App-top-nav-side">
					<SearchBar
						handleSearchChange={this.props.handleSearchChange}
						submitSearch={this.props.submitSearch}
						query={this.props.query}
					/>
				</div>
				{/* <BCSearch
					showFullSearchBar={this.state.showFullSearchBar}
					setShowFullSearchBar={() => 5}
					setFilter={this.props.setFilter}
				/> */}
			</Segment>
		);
	}
}

export default TopNav;
