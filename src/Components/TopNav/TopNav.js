import React from "react";
import styled from 'styled-components';
import BCLogo from "../BCLogo";
import OpenTab from "./OpenTab";


const TopNavStyle = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  height: 80px;
  position: absolute;
  z-index: 1;
  // margin: 15px 25px;
  width: 100%;

  @media (max-width: ${ ({ theme }) => theme.breakpoints.phoneWidth } ) {
    justify-content: center;
  }
`;


const TopNav = ({ isMobile, forceReopenCollectionDetail }) => {

  return (
    <TopNavStyle>
      <OpenTab forceReopenCollectionDetail={forceReopenCollectionDetail} />
      {/* <Link to="/#"> */}
      <div className="TopNavLogo" style={{ margin: "1.5em 3.5em" }}>
        <BCLogo centerOnMediaQuery />
      </div>
      {/* </Link> */}
    </TopNavStyle>
  );
};

export default TopNav;
