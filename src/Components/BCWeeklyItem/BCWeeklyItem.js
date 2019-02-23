import React from 'react';
import Responsive from 'react-responsive';
import LoadingIcon from '../LoadingIcon';
import ShareButton from '../ShareButton';
import BCProgressiveImage from '../BCProgressiveImage';
import './BCWeeklyItem.scss';

// we have to remove the old tracklist and add the new one at exactly the same time.


const BCWeeklyItemOverlay = ({ num }) => (
  <div className="BCWeeklyItem-cover-text visible">
    <div className="BCWeeklyItem-cover-text-title">
      {' '}
      Week {num}{' '}
    </div>
    {/* {(loadingCollectionTracks && active) ?
            <LoadingIcon width={20} />
            :
          } */}
    <div className="BCWeeklyItem-line" />
    <div className="BCWeeklyItem-cover-text-subtitle">
      {' '}
      Burn Cartel Weekly{' '}
    </div>
    {/* <Responsive minDeviceWidth={950}>
            <ShareButton
              handleModalOpen={() => handleModalOpen(collection_num)}
            />
            </Responsive> */}
  </div>
);

class BCWeeklyItem extends React.Component {
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

    // const style2 = active  ? 'visible' : 'hidden';
    // const style2 = active || this.state.hover ? 'visible' : 'hidden';
    // const style2 = 'visible';

    const style = active
      ? { borderRadius: '4px', border: '1px solid #e54ea3' }
      : {};

    return (
      <div
        className="BCWeeklyItem"
        style={style}
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
        <div className="BCWeeklyItem-cover">
          {/* https://itnext.io/stable-image-component-with-placeholder-in-react-7c837b1ebee */}
          {/* https://peter.coffee/how-to-use-css-pseudo-elements-to-add-a-gradient-to-images */}
          <BCProgressiveImage
            isActive={active}
            isCollectionItem
            artwork_url={artwork_url}
            incrementCollectionImagesLoaded={incrementCollectionImagesLoaded}
            max_width={600}
          />
          <BCWeeklyItemOverlay num={collection_num} />
        </div>
      </div>
    );
  }
}

export default BCWeeklyItem;
