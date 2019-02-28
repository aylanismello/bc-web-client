import React from 'react';
import { Link } from 'react-router-dom';
import BCLogo from '../BCLogo';
import './top_nav.scss';

class TopNav extends React.Component {
  render() {
    return (
      <div className="TopNav">
        <Link to="/#">
          <div className="TopNavLogo" style={{ margin: '1.5em 2.5em' }}>
            <BCLogo />
          </div>
        </Link>
      </div>
    );
  }
}

export default TopNav;
