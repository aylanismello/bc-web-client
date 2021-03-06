import React from "react";
import styled from "styled-components";
import { Button, ContentWrapper } from "../MarakuyaComponents";
import BCLogo from "../BCLogo";
import OpenTab from "./OpenTab";
/* height: ${({isMobile}) => isMobile ? '40px' : '72px'}; */

const TopNavStyle = styled.div`
  background: ${({ theme }) => theme.colors.gray_2};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.top};
  width: 100%;
`;

const TopNav = ({ isMobile, forceReopenCollectionDetail, sideMenuOpen }) => {
  return (
    <TopNavStyle isMobile={isMobile} class="TopNavStyle">
      {isMobile ? null : (
        <OpenTab forceReopenCollectionDetail={forceReopenCollectionDetail} />
      )}
      <ContentWrapper>
        <BCLogo sideMenuOpen={sideMenuOpen} />
      </ContentWrapper>
    </TopNavStyle>
  );
};

export default TopNav;
