import styled from 'styled-components';
import React from 'react';

const tabLineMargin = 15;
const tabLineHeight = '2px';

const CollectionTabs = styled.div``;
const CollectionTabsStyle = styled.div`
  display: flex;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const CollectionLine = styled.div`
  width: auto;
  height: ${tabLineHeight};
  background: #262632;
  margin-top: ${`${tabLineMargin}px`};
`;

const CollectionTabStyle = styled.div`
  margin-right: 2rem;
  color: ${props => (props.selected ? "white" : "#626970")};
  font-family: "sofia-pro", sans-serif;
  font-size: 16px;
  font-weight: 600;
  position: relative;
`;

const CollectionTabText = styled.div`
  padding: 5px 5px 5px 0;
  
  &:hover {
    cursor: pointer;
  }
`;

const CollectionTabLine = styled.div`
  display: ${props => (props.selected ? 'block' : 'none')};
  border-radius: 20px;
  width: 100%;
  height: ${tabLineHeight};
  background: #6255ff;
  position: absolute;
  top: ${`${tabLineMargin + 26}px`};
`;

const CollectionTab = ({ children, selected, onClick }) => (
  <CollectionTabStyle selected={selected}>
    <CollectionTabText onClick={onClick} className="CollectionTabText">
      {children}
    </CollectionTabText>
    <CollectionTabLine selected={selected} className="CollectionTabLine" />
  </CollectionTabStyle>
);

export default ({ selectCollectionType, collectionTypeSelected }) => (
  <CollectionTabs className="CollectionTabs">
    <CollectionTabsStyle className="CollectionTabsStyle">
      <CollectionTab
        onClick={() => selectCollectionType(0)}
        selected={collectionTypeSelected === 0}
      >
        {' '}
        Curated{' '}
      </CollectionTab>
      <CollectionTab
        onClick={() => selectCollectionType(1)}
        selected={collectionTypeSelected === 1}
      >
        {' '}
        Rising{' '}
      </CollectionTab>
    </CollectionTabsStyle>
    <CollectionLine className="CollectionTabsLine" />
  </CollectionTabs>
);
