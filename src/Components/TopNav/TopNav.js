import React from 'react';
// import { Link } from 'react-router-dom';
import BCLogo from '../BCLogo';
import OpenTab from './OpenTab';
import './top_nav.scss';

const TopNav = ({ isMobile, forceReopenCollectionDetail }) => {
  return (
    <div className="TopNav">
      {!isMobile && (
        <OpenTab
          forceReopenCollectionDetail={forceReopenCollectionDetail}
        />
      )}
      {/* <Link to="/#"> */}
      <div className="TopNavLogo" style={{ margin: '1.5em 3.5em' }}>
        <BCLogo centerOnMediaQuery />
      </div>
      {/* </Link> */}
    </div>
  );
};

export default TopNav;
