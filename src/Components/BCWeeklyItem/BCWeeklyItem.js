import React from 'react';
import Responsive from 'react-responsive';
import LoadingIcon from '../LoadingIcon';
import ShareButton from '../ShareButton';
import BCProgressiveImage from '../BCProgressiveImage';
import './BCWeeklyItem.scss';

// we have to remove the old tracklist and add the new one at exactly the same time.

class BCWeeklyItem extends React.Component {
  state = {
    hover: false
  };

  constructor(props) {
    super(props);
    this.currentTracklist = [];
  }

  render() {
    const {
      collection,
      active,
      updateActiveCollection,
      idx,
      handleModalOpen,
      loadingCollectionTracks,
      incrementCollectionImagesLoaded
    } = this.props;
    const { artwork_url, collection_num } = collection;

    const style2 = active || this.state.hover ? 'visible' : 'hidden';

    return (
      <div
        className="BCWeeklyItem"
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
        <div className="BCWeeklyItem-cover" >
          {/* https://itnext.io/stable-image-component-with-placeholder-in-react-7c837b1ebee */}
          <BCProgressiveImage
            showText={active || this.state.hover}
            isCollectionItem
            artwork_url={artwork_url}
            incrementCollectionImagesLoaded={incrementCollectionImagesLoaded}
            max_width={600}
          />
          <div className={`BCWeeklyItem-cover-text ${style2}`}>
            <h4> BURN CARTEL WEEKLY </h4>
            {(loadingCollectionTracks && active) ?
            <LoadingIcon width={20} />
            :
            <div className="BCWeeklyItem-line" />
            }
            <h4> WEEK {collection_num} </h4>
            <Responsive minDeviceWidth={950}>
            <ShareButton
              handleModalOpen={() => handleModalOpen(collection_num)}
            />
            </Responsive>
          </div>
        </div>
      </div>
    );
  }
}

export default BCWeeklyItem;
