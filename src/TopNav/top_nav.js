import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import SearchBar from '../SearchBar';
import './top_nav.css';
import BCLogo from '../BCLogo';
import seizure from './seizure.png';

const { func, bool } = propTypes;

class TopNav extends React.Component {
	static propTypes = {
		toggleSidebar: func.isRequired,
		setFilter: func.isRequired,
		vis: bool.isRequired,
	};

	state = {
		showFullSearchBar: false
	};

	renderEye() {
    if (this.props.vis) {
    	return <Icon
				name={this.props.vis ? 'eye slash outline' : 'eye'}
				onClick={this.props.handleVisChange}
				size="large"
				style={{color: 'white', cursor:'pointer'}}
			/>
		}
		return <img
			src={seizure}
			onClick={this.props.handleVisChange}
			style={{
				height:'44px',
				width:'44px',
				background:('rgba(0,0,0,0.5)'),
				cursor:'pointer'
			}}
		/>
	}

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
						onClick={() => {
							this.props.toggleSidebar();
							window.amplitude.getInstance().logEvent('Open/Close Sidebar');
						}}
					/>
				</div>

				<div className="App-top-nav-side">
					<Link
						to="/"
						onClick={() => {
							window.amplitude.getInstance().logEvent('Click on BC Logo', {
								fromPage: window.location.href
							});
						}}
					>
						<BCLogo>
							{this.props.children}
						</BCLogo>
					</Link>
				</div>

				<div className="App-top-nav-side">
					<SearchBar
						handleSearchChange={this.props.handleSearchChange}
						submitSearch={this.props.submitSearch}
						query={this.props.query}
					/>
					{this.renderEye.bind(this)()}
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
