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
      showText,
      incrementCollectionImagesLoaded,
      isCollectionItem,
      isCollectionDetailImage
    } = this.props;
    const { loaded } = this.state;
    const opaque = showText ? 'opaque' : '';


    const q = isCollectionDetailImage ? 80 : 70;

    const src = `https://res.cloudinary.com/burncartel/image/upload/c_fit,q_${q},w_${max_width}/${artwork_url}`;
  
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
            onLoad={() => {
              if (isCollectionDetailImage) {
                // console.log('going to force check');
                // forceCheck();
              }

              incrementCollectionImagesLoaded();
            }}
            alt={artwork_url}
            src={placeholder}
          />
        ) : null}

        <LazyLoad height="auto" offset={200} once>
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
  showText: false,
  incrementCollectionImagesLoaded: () => {},
  isCollectionDetailImage: false,
  isVisible: false
};

export default BCProgressiveImage;
