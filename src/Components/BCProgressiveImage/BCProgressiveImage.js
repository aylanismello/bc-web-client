import React from 'react';
import ProgressiveImage from 'react-progressive-image';
import './BCProgressiveImage.scss';

const BCProgressiveImage = ({
  max_width,
  artwork_url,
  children,
  active,
  isCollectionItem
}) => {
  // THERE IS THE MAX_WIDTH that we load, just in case
  // and the width we use

  // max width is what

  const opaque = active ? 'opaque' : '';

  const src = `http://res.cloudinary.com/burncartel/image/upload/c_fit,q_70,w_${max_width}/${artwork_url}`;
  const IMAGE_COLOR = '#626970';
  // const IMAGE_COLOR = 'red';

  return (
    // this needs to be the responsive part

    <div className="BCProgressiveImage">
      <ProgressiveImage
        className="BCProgressiveImage-img"
        src={src}
        placeholder=""
      >
        {(loadedSrc, loading) => {
          return loading ? (
            <div
              className="placeholder"
              style={{
                backgroundColor: IMAGE_COLOR,
                width: '100%',
                height: '100%'
              }}
            />
          ) : (
            <img
              // god this is ugly but whatever
              className={`BCProgressiveImage-img ${opaque} ${isCollectionItem &&
                'BCWeeklyItem-cover-image'}`}
              alt={artwork_url}
              src={loadedSrc}
            />
          );
        }}
      </ProgressiveImage>
      {children}
    </div>
  );
};

export default BCProgressiveImage;
