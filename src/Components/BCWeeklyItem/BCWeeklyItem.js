import React from 'react';
import { Image } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';
import Responsive from 'react-responsive';
import BCProgressiveImage from '../BCProgressiveImage';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import ShareButton from '../ShareButton';
import './BCWeeklyItem.scss';

class BCWeeklyItem extends React.Component {
  state = {
    hover: false
  };

  render() {
    const {
      collection,
      active,
      setAsActiveItem,
      idx,
      playTrack,
      activeTrack,
      handleModalOpen
    } = this.props;
    const { artwork_url, collection_num } = collection;
    const style1 = active ? 'opaque' : '';
    // probs set this dynamically, responsively
    // all stryle here are computed based on React media queries,
    // so let's reflect that.
    const width = 600;
    // const top = 150;

    const style2 = active || this.state.hover ? 'visible' : 'hidden';
    
    return (
      <div
        className="BCWeeklyItem"
        onClick={e => {
          if (
            !e.target.className.includes('ShareButton') &&
            !e.target.className.includes('title')
          ) {
            setAsActiveItem(collection_num);
          }
        }}
        id={idx}
      >
        <div
          className="BCWeeklyItem-cover"
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
        >
          {/* TODO: somehow make default set to whatever */}
          {/* <BCProgressiveImage
            artwork_url={artwork_url}
            isCollectionItem
            max_width={width}
            active={active}
          >
            <div className={`BCWeeklyItem-cover-text ${style2}`}>
              <h4> BURN CARTEL WEEKLY </h4>
              <div className="BCWeeklyItem-line" />
              <h4> WEEK {collection_num} </h4>
              <ShareButton
                handleModalOpen={() => handleModalOpen(collection_num)}
              />
            </div>
          </BCProgressiveImage> */}

          <LazyLoad
          width={width}
          height={width}
          once
        >
        <span></span>
          <Image
            className={`BCWeeklyItem-cover-image ${style1}`}
            width={width}
            crop="fit"
            quality="70"
            cloudName="burncartel"
            publicId={artwork_url}
          />
        </LazyLoad>
          <div className={`BCWeeklyItem-cover-text ${style2}`}>
          <h4> BURN CARTEL WEEKLY </h4>
          <div className="BCWeeklyItem-line" />
          <h4> WEEK {collection_num} </h4>
          <ShareButton handleModalOpen={() => handleModalOpen(collection_num)} />
        </div>
        </div>
        <Responsive maxWidth={950}>
          {active && collection.tracks && (
            <BCWeeklyTracklist
              idx={idx}
              tracks={collection.tracks.slice(1)}
              activeTrack={activeTrack}
              playTrack={playTrack}
              collection={collection}
            />
          )}
        </Responsive>
      </div>
    );
  }
}

export default BCWeeklyItem;
