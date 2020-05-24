import React, { useEffect } from "react";
import BCLogo from "../BCLogo";
import OpenTab from "./OpenTab";
import "./top_nav.scss";
import useCollectionsQuery from '../../Hooks/useCollectionsQuery';

const liveDataVsCached = (liveData, cached) => {
  console.log("OUR DATA IS OUT OF SYNC - here is our data");
  console.log(liveData);
  console.log("THIS IS OUR CACHED RESULTS");
  console.log(cached);
};

const TopNav = ({ isMobile, forceReopenCollectionDetail }) => {
  const { data, loading, error } = useCollectionsQuery({ fetchPolicy: 'network-only' })

  return (
    <div className="TopNav">
      {!isMobile && (
        <OpenTab forceReopenCollectionDetail={forceReopenCollectionDetail} />
      )}
      {/* <Link to="/#"> */}
      <div className="TopNavLogo" style={{ margin: "1.5em 3.5em" }}>
        <BCLogo centerOnMediaQuery />
      </div>
      {/* </Link> */}
    </div>
  );
};

export default TopNav;
