import React from 'react';
import styled from 'styled-components';
// import styled from 'styled-components';
// import Responsive from 'react-responsive';
// import LoadingIcon from '../LoadingIcon';
// import ShareButton from '../ShareButton';
import { getWeeklyItemTexts } from '../../helpers';
import Play from './Play';
import BCProgressiveImage from '../BCProgressiveImage';
import './BCWeeklyItem.scss';

// ORGANIZING WITH STYLED COMPONENTSs
// https://stackoverflow.com/questions/42987939/styled-components-organization

const BCWeeklyItemWrapper = styled.div`
  border-radius: 4px;
  border: ${props => (props.isPlayingCollection ? '1px solid #e54ea3' : '1px solid transparent')};
  position: relative;
`;

const BCWeeklyItemText = (collection) => {
  const texts = getWeeklyItemTexts(collection.collection);
  
  return (
  <div className="BCWeeklyItem-cover-text visible">
    <div className="BCWeeklyItem-cover-text-title"> {texts[0]} </div>
    <div className="BCWeeklyItem-line" />
    <div className="BCWeeklyItem-cover-text-subtitle">  {texts[1]} </div>
  </div>
  );
};

class BCWeeklyItem extends React.Component {
  state = {
    hover: false,
    isTabletOrPhone: false
  }

  constructor(props) {
    super(props);
    this.currentTracklist = [];
  }

  componentWillMount() {
    if (window.screen.width < 768) {
      this.setState({ isTabletOrPhone: true });
    }
  }

  render() {
    const {
      collection,
      active,
      updateActiveCollection,
      idx,
      handleModalOpen,
      loadingCollectionTracks,
      incrementCollectionImagesLoaded,
      playing,
      playingCollectionNum,
      loadingTrack
    } = this.props;
    const { artwork_url, collection_num } = collection;

    const showPlay = this.state.hover || active || this.state.isTabletOrPhone;

    const isPlayingCollection = playingCollectionNum === collection_num;

    return (
      <BCWeeklyItemWrapper
        isPlayingCollection={isPlayingCollection}
        className="BCWeeklyItem"
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        onClick={e => {
          if (
            e.target.className.includes &&
            !e.target.className.includes('ShareButton') &&
            !e.target.className.includes('title')
          ) {
            window.idx = idx;
            updateActiveCollection(collection_num);
          }
        }}
        id={idx}
      >
        {/* https://itnext.io/stable-image-component-with-placeholder-in-react-7c837b1ebee */}
        {/* https://peter.coffee/how-to-use-css-pseudo-elements-to-add-a-gradient-to-images */}
        <BCProgressiveImage
          isActive={active}
          isCollectionItem
          artwork_url={artwork_url}
          incrementCollectionImagesLoaded={incrementCollectionImagesLoaded}
          max_width={600}
        />

        <Play show={showPlay} playing={playing && active} loading={(loadingTrack || loadingCollectionTracks) && active} />
        <BCWeeklyItemText collection={collection} />
      </BCWeeklyItemWrapper>
    );
  }
}

export default BCWeeklyItem;
