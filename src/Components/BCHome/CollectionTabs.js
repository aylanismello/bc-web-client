import styled from 'styled-components';
import React from 'react';

const tabLineMargin = 15;
const tabLineHeight = '2px';

const CollectionTabs = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
`;

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
  color: ${props => (props.selected ? 'white' : '#626970')};
  font-family: 'sofia-pro', sans-serif;
  font-size: 16px;
  font-weight: 600;
  position: relative;
`;

const CollectionTabText = styled.div`
  padding: 5px 5px 5px 0;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: safe;
  justify-content: space-between;
  width: 70px;

  &:hover {
    cursor: pointer;
  }
`;

const CollectionTabLineHighlight = styled.div`
  display: ${props => (props.selected ? 'block' : 'none')};
  border-radius: 20px;
  width: 110%;
  height: ${tabLineHeight};
  background: #6255ff;
  position: absolute;
  top: ${`${tabLineMargin + 36}px`};
`;

const CollectionTabNotify = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  position: absolute;
  top: 10px;
  right: -7px;
  width: 8px;
  height: 8px;
  border-radius: 9px;
  background-color: #f34b4b;
`;

const CollectionTabIcon = ({ idx }) => {
  switch (idx) {
    case 0:
      return <span>🔥</span>;
    case 1:
      return <span>📈</span>;
    case 2:
      return <span>🎧</span>;
    case 3:
      return <span>💯</span>;
    default:
      return <span />;
  }
};

const CollectionTab = ({ children, selected, onClick, isNew, idx }) => (
  <CollectionTabStyle selected={selected}>
    <CollectionTabNotify show={isNew} className="CollectionTabNotify" />
    <CollectionTabText onClick={onClick} className="CollectionTabText">
      <CollectionTabIcon idx={idx} />
      <span>{children}</span>
    </CollectionTabText>
    <CollectionTabLineHighlight selected={selected} className="CollectionTabLineHighlight" />
  </CollectionTabStyle>
);

export default ({
  collectionTypeSelected,
  show,
  setNewFeatureClicked,
  selectCollectionType,
  newFeatureClicked,
}) => {
  return (
    <CollectionTabs className="CollectionTabs" show={show}>
      <CollectionTabsStyle className="CollectionTabsStyle">
        <CollectionTab
          onClick={() => {
            setNewFeatureClicked();
            selectCollectionType(1);
          }}
          selected={collectionTypeSelected === 1}
          isNew={!newFeatureClicked}
          idx={1}
        >
          {' '}
          Rising{' '}
        </CollectionTab>
        <CollectionTab
          onClick={() => selectCollectionType(0)}
          selected={collectionTypeSelected === 0}
          idx={0}
        >
          {' '}
          Curated{' '}
        </CollectionTab>
        <CollectionTab
          onClick={() => {
            // setNewFeatureClicked(); i get this but not necessary rn
            selectCollectionType(2);
          }}
          selected={collectionTypeSelected === 2}
          isNew={!newFeatureClicked}
          idx={2}
        >
          {' '}
          Curators{' '}
        </CollectionTab>
        <CollectionTab
          onClick={() => {
            // setNewFeatureClicked(); i get this but not necessary rn
            selectCollectionType(3);
          }}
          selected={collectionTypeSelected === 3}
          isNew={!newFeatureClicked}
          idx={3}
        >
          {' '}
          Featured Artists{' '}
        </CollectionTab>
      </CollectionTabsStyle>
      <CollectionLine className="CollectionTabsLine" />
    </CollectionTabs>
  );
};
