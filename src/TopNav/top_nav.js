import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import SearchBar from '../SearchBar';
import './top_nav.scss';
import BCLogo from '../BCLogo';

const { func } = propTypes;

class TopNav extends React.Component {
  static propTypes = {
    toggleSidebar: func.isRequired
  };

  render() {
    return (
      <Segment
        className="App-top-nav"
        onClick={() => {
          this.props.toggleSidebar({ clickedOutsideMenu: true });
        }}
      >
        {/*		<div className="App-top-nav-side">
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
				*/}

          {/*    <Link
            to="/"
						className="TopNav-BCLogo-Link"
            onClick={() => {
              window.amplitude.getInstance().logEvent('Click on BC Logo', {
                fromPage: window.location.href
              });
            }}
          > */}
          <BCLogo />
          {/*
          </Link>
					*/}

        {/* <div className="App-top-nav-side">
          <SearchBar
            handleSearchChange={this.props.handleSearchChange}
            submitSearch={this.props.submitSearch}
            query={this.props.query}
          />
        </div>
				*/}
      </Segment>
    );
  }
}

export default TopNav;
