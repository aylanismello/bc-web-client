import React from 'react';
import { gql, useQuery } from "@apollo/client";
import BCLogo from '../BCLogo';
import OpenTab from './OpenTab';
import './top_nav.scss';

const COLLECTIONS = gql`
  {
    collections {
      name
    }
  }
`;

const TopNav = ({ isMobile, forceReopenCollectionDetail }) => {
  const { data, loading, error } = useQuery(COLLECTIONS);

  if(!loading) {
    console.log('yee got dataz');
    console.log(data);
  }

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
