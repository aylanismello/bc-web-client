import React from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import './BCProgressiveImage.scss';
import placeholder from './placeholder.svg';

class BCProgressiveImage extends React.Component {
  state = {
    loaded: false
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.isVisible && nextProps.isVisible) {
      setTimeout(() => {
        forceCheck();
      }, 100);
    }
  }

  render() {
    const {
      max_width,
      artwork_url,
      showOpaqueLayer,
      incrementCollectionImagesLoaded,
      isCollectionItem
    } = this.props;
    const { loaded } = this.state;
    const opaque = showOpaqueLayer ? 'opaque' : '';

    const q = 70;
    const src = artwork_url.includes('http')
      ? artwork_url
      : `https://res.cloudinary.com/burncartel/image/upload/c_fit,q_${q},w_${max_width}/${artwork_url}`;

    // https://itnext.io/stable-image-component-with-placeholder-in-react-7c837b1ebee
    return (
      <div>
        {!loaded ? (
          <img
            className={`BCProgressiveImage ${opaque} ${
              isCollectionItem ? 'BCWeeklyItem-cover-image' : 'BCSplotlightItem-cover-image'
            }`}
            onLoad={() => {
              incrementCollectionImagesLoaded();
            }}
            alt={artwork_url}
            src={placeholder}
            draggable={false}
          />
        ) : null}

        <LazyLoad height="auto" offset={200} once>
          <img
            className={`BCProgressiveImage ${opaque} ${
              isCollectionItem ? 'BCWeeklyItem-cover-image' : 'BCSplotlightItem-cover-image'
            }`}
            alt={artwork_url}
            style={loaded ? {} : { visibility: 'hidden' }}
            draggable={false}
            src={src}
            onLoad={() => {
              this.setState({ loaded: true });
              incrementCollectionImagesLoaded();
            }}
          />
        </LazyLoad>
      </div>
    );
  }
}

BCProgressiveImage.defaultProps = {
  isCollectionItem: false,
  showOpaqueLayer: false,
  incrementCollectionImagesLoaded: () => {},
  isVisible: false
};

export default BCProgressiveImage;
