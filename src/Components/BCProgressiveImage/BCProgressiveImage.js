import React from 'react';
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
      </div>
    );
  }
}

BCProgressiveImage.defaultProps = {
  onLoad: () => {},
  isCollectionItem: false,
  showText: false
};

//   return (
//     // this needs to be the responsive part

//     <div className="BCProgressiveImage">
//       <ProgressiveImage
//         className="BCProgressiveImage-img"
//         src={src}
//         placeholder=""
//       >
//         {(loadedSrc, loading) => {
//           return loading ? (
//             <div
//               className="placeholder"
//               style={{
//                 backgroundColor: IMAGE_COLOR,
//                 width: '100%',
//                 height: '100%'
//               }}
//             />
//           ) : (
//             <img
//               // god this is ugly but whatever
//               className={`BCProgressiveImage-img ${opaque} ${isCollectionItem &&
//                 'BCWeeklyItem-cover-image'}`}
//               alt={artwork_url}
//               src={loadedSrc}
//             />
//           );
//         }}
//       </ProgressiveImage>
//       {children}
//     </div>
//   );
// };

export default BCProgressiveImage;
