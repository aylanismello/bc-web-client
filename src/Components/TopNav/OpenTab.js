import React from 'react';
import styled from 'styled-components';
import leftArrow from './chevron-left.svg';

const OpenTabContainer = styled.div`
  width: 16px;
  height: 40px;
  border-radius: 0 4px 4px 0;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;

  &:hover {
    cursor: pointer;
  }
`;

const TabIcon = styled.img`
  width: 24px;
  height: 20px;
`;

const OpenTab = ({ forceReopenCollectionDetail }) => (
  <OpenTabContainer className="OpenTabContainer" onClick={forceReopenCollectionDetail}>
    <TabIcon src={leftArrow} />
  </OpenTabContainer>
);

export default OpenTab;
