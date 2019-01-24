import React from 'react';
import { Link } from 'react-router-dom';
import BCLogo from '../BCLogo';
import './top_nav.scss';

class TopNav extends React.Component {
  render() {
    return (
      <div className="TopNav">
        <Link to="/#">
          <BCLogo />
        </Link>
      </div>
    );
  }
}

export default TopNav;
