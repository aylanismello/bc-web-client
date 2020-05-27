import styled from 'styled-components';
import React from 'react';

const WrapperStyle = styled.div`
  margin: auto 100px;
  display: flex;
  width: ${({ theme }) => theme.breakpoints.desktopWidth};

  margin-bottom: ${({ isMainContent }) => (isMainContent ? "50px" : "")};
  flex-direction: ${({ isMainContent }) => (isMainContent ? "column" : "")};


  @media (max-width: ${({ theme }) => theme.breakpoints.phoneWidth}) {
    margin: auto 20px;
  }
`;

const ContentWrapper = ({ children, isMainContent }) => (
  <WrapperStyle isMainContent={isMainContent} className="ContentWrapper">
    {children}
  </WrapperStyle>
);

export default ContentWrapper;
