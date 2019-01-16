import React from 'react';
import LazyLoad from 'react-lazyload';
import './BCProgressiveImage.scss';
import placeholder from './placeholder.svg';

class BCProgressiveImage extends React.Component {
  state = {
    loaded: false
  };

  render() {
    const {
      max_width,
      artwork_url,
      showText,
      onLoad,
      isCollectionItem
    } = this.props;
    const { loaded } = this.state;
    const opaque = showText ? 'opaque' : '';

    const src = `https://res.cloudinary.com/burncartel/image/upload/c_fit,q_70,w_${max_width}/${artwork_url}`;

    const lazyLoadImage = () => (
      <img
        className={`BCProgressiveImage ${opaque} ${
          isCollectionItem
            ? 'BCWeeklyItem-cover-image'
            : 'BCSplotlightItem-cover-image'
        }`}
        alt={artwork_url}
        style={loaded ? {} : { visibility: 'hidden' }}
        src={src}
        onLoad={() => {
          this.setState({ loaded: true });
          onLoad();
        }}
      />
    );

    // https://itnext.io/stable-image-component-with-placeholder-in-react-7c837b1ebee
    return (
      <div>
        {!loaded ? (
          <img
            className={`BCProgressiveImage ${opaque} ${
              isCollectionItem
                ? 'BCWeeklyItem-cover-image'
                : 'BCSplotlightItem-cover-image'
            }`}
            alt={artwork_url}
            src={placeholder}
          />
        ) : null}

{/* you dont want to lazy load the banner image :( */}
        {/* {isCollectionItem ? (<LazyLoad> {lazyLoadImage()} </LazyLoad>) : lazyLoadImage() } */}
        {/* {lazyLoadImage()} */}
        <LazyLoad offset={200}>
          {lazyLoadImage()}
        </LazyLoad>
      </div>
    );
  }
}

BCProgressiveImage.defaultProps = {
  onLoad: () => {},
  isCollectionItem: false,
  showText: false
};

export default BCProgressiveImage;
