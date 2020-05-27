import React from "react";
import styled from "styled-components";
import { Button } from "../MarakuyaComponents";
import BCLogo from "../BCLogo";
import OpenTab from "./OpenTab";

const TopNavStyle = styled.div`
  background: ${({ theme }) => theme.colors.gray_2};
  display: flex;
  justify-content: center;
  height: 72px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
`;

const TopNavContent = styled.div`
  border: 1px solid red;
  margin: auto 100px;
  align-items: center;
  
  display: flex;
  width: ${({ theme }) => theme.breakpoints.desktopWidth};
  @media (max-width: ${({ theme }) => theme.breakpoints.phoneWidth}) {
    /* justify-content: center; */
    margin: auto 20px;
  }
`;

const TopNav = ({ isMobile, forceReopenCollectionDetail }) => {
  return <TopNavStyle class="TopNavStyle">
      <TopNavContent class="TopNavContent">
        <OpenTab forceReopenCollectionDetail={forceReopenCollectionDetail} />
        {/* <Link to="/#"> */}
        {/* <div className="TopNavLogo" style={{ margin: "1.5em 3.5em" }}> */}
        <div className="TopNavLogo">
          <BCLogo />
        </div>
        {/* </Link> */}
      </TopNavContent>
    </TopNavStyle>;
};

export default TopNav;
