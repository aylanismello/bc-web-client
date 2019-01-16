import React from 'react';
import Responsive from 'react-responsive';
import BCWeeklyTracklist from '../BCWeeklyTracklist';
import BCProgressiveImage from '../BCProgressiveImage';
import ShareButton from '../ShareButton';
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

  componentWillUpdate(nextProps) {
    if (!this.props.canShowTracklist && nextProps.canShowTracklist) {
      console.log('NOW WE CAN SWITCH COLLECTION TRACKSLISTS BECAUSE THEY HAVE BEEN SCROLLED TO');
      // this.currentTracklist = collection.tracks.slice(1);
      // this.props.turnOffCanSwitchCollection();
    }
  }

  render() {
    const {
      collection,
      active,
      setAsActiveItem,
      idx,
      playTrack,
      activeTrack,
      canShowTracklist,
      handleModalOpen,
      incrementCollectionImagesLoaded
    } = this.props;
    const { artwork_url, collection_num } = collection;

    const style2 = active || this.state.hover ? 'visible' : 'hidden';
    if (active && collection.tracks) {
      // console.log('collection tracks are now available');
    }
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
            <div className="BCWeeklyItem-line" />
            <h4> WEEK {collection_num} </h4>
            <ShareButton
              handleModalOpen={() => handleModalOpen(collection_num)}
            />
          </div>
        </div>

        {/* <Responsive maxWidth={950}>
          {active && this.state.currentTracklist && canShowTracklist && (
            <BCWeeklyTracklist
              idx={idx}
              tracks={this.state.currentTracklist.slice(1)}
              activeTrack={activeTrack}
              playTrack={playTrack}
              collection={collection}
            />
          )}
        </Responsive> */}
        <Responsive maxWidth={950}>
          {active && collection.tracks && canShowTracklist && (
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
