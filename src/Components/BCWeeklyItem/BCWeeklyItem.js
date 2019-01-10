import React from 'react';
import { Image } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';
import Responsive from 'react-responsive';
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
      handleModalOpen, 
      scrollToCollection
    } = this.props;
    const { artwork_url, collection_num } = collection;
    const style1 = active ? 'opaque' : '';

    const width = 600;
    const style2 = active || this.state.hover ? 'visible' : 'hidden';
    const src = `http://res.cloudinary.com/burncartel/image/upload/c_fit,q_70,w_${width}/${artwork_url}`;
    return (
      <div
        className="BCWeeklyItem"
        onClick={e => {
          if (
            e.target.className.includes &&
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
          {/* <LazyLoad width={width} height={width} once> */}
            <img // god this is ugly but whatever
              className={`BCWeeklyItem-cover-image ${style1}`}
              alt={artwork_url}
              src={src}
              onLoad={() => {
                if (active) {
                  console.log('active collection loaded!');
                  scrollToCollection(idx);
                }
              }}
            />
            /> */}
          {/* </LazyLoad> */}
          <div className={`BCWeeklyItem-cover-text ${style2}`}>
            <h4> BURN CARTEL WEEKLY </h4>
            <div className="BCWeeklyItem-line" />
            <h4> WEEK {collection_num} </h4>
            <ShareButton
              handleModalOpen={() => handleModalOpen(collection_num)}
            />
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
