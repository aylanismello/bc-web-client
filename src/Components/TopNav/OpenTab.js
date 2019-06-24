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
  position: fixed;
  left: 0;

  &:hover {
    cursor: pointer;
  }
`;

const OpenTab = ({ forceReopenCollectionDetail }) => (
  <OpenTabContainer
    className="OpenTabContainer"
    onClick={forceReopenCollectionDetail}
  >
    <img src={leftArrow} />
  </OpenTabContainer>
);

export default OpenTab;
